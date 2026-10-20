#!/usr/bin/env node
/*
 * Verifies the package content (plan 8.2):
 *   1. every var(--hs-...) used in a CSS file is declared (tokens.css, or locally);
 *   2. every file in css/components/ is imported by css/index.css;
 *   3. every text file is ASCII;
 *   4. every @font-face url() points at an existing file;
 *   5. every icon <use href="...#id"> in specimen/parts references a shipped icon.
 * Each failure prints the file and the offending item; exits 1 on any failure.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

function toPosix(path) {
  return path.split(sep).join('/');
}

const SKIP_DIRS = new Set(['.git', 'node_modules']);
const SKIP_HIDDEN = new Set(['.git']);
const BINARY_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.woff', '.woff2', '.ttf', '.otf']);
const TEXT_EXTS = new Set([
  '.css', '.js', '.mjs', '.cjs', '.ts', '.html', '.md', '.json', '.svg', '.txt',
  '.yml', '.yaml', '.toml', '.map',
]);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name) || SKIP_HIDDEN.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function isTextFile(path) {
  const ext = extname(path).toLowerCase();
  if (BINARY_EXTS.has(ext)) return false;
  if (TEXT_EXTS.has(ext)) return true;
  const base = path.slice(path.lastIndexOf(sep) + 1);
  return base === 'LICENSE' || base === '.gitignore';
}

function lineOf(source, index) {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i += 1) {
    if (source[i] === '\n') line += 1;
  }
  return line;
}

function collectDeclarations(source) {
  const names = new Set();
  const re = /(--hs-[a-z0-9-]+)\s*:/gi;
  let match;
  while ((match = re.exec(source)) !== null) names.add(match[1]);
  return names;
}

function checkTokens(cssFiles, sources) {
  const tokensPath = join(root, 'css', 'tokens.css');
  const tokenSource = sources.get(tokensPath);
  if (!tokenSource) {
    fail('css/tokens.css', 'missing');
    return;
  }
  const global = collectDeclarations(tokenSource);
  const baseSource = sources.get(join(root, 'css', 'base.css'));
  if (baseSource) {
    for (const name of collectDeclarations(baseSource)) global.add(name);
  }

  if (collectDeclarations(tokenSource).has('--hs-accent-ind')) {
    fail('css/tokens.css', 'declares --hs-accent-ind, which is removed from the published token set (f06-r4, k08)');
  }

  for (const file of cssFiles) {
    const source = sources.get(file);
    const fileRel = toPosix(relative(root, file));
    const local = collectDeclarations(source);
    const re = /var\(\s*(--hs-[a-z0-9-]+)/gi;
    let match;
    while ((match = re.exec(source)) !== null) {
      const token = match[1];
      if (!global.has(token) && !local.has(token)) {
        fail(fileRel, `var(${token}) has no declaration in css/tokens.css (or css/base.css)`);
      }
      if (token === '--hs-accent-ind') {
        fail(fileRel, `uses ${token}, which is removed from the published token set`);
      }
    }
  }
}

function checkComponentImports(indexSource, components) {
  const imported = new Set();
  const importRe = /@import\s+(?:url\()?['"]components\/([^'")]+)\.css['"]\)?/g;
  let match;
  while ((match = importRe.exec(indexSource)) !== null) imported.add(`${match[1]}.css`);

  for (const file of components) {
    if (!imported.has(file)) {
      fail('css/index.css', `does not import components/${file}`);
    }
  }
  for (const file of imported) {
    if (!components.includes(file)) {
      fail('css/index.css', `imports components/${file}, which does not exist`);
    }
  }

  const topRe = /@import\s+(?:url\()?['"]([^'"/]+\.css)['"]\)?/g;
  const top = new Set();
  while ((match = topRe.exec(indexSource)) !== null) top.add(match[1]);
  for (const file of ['tokens.css', 'base.css']) {
    if (!top.has(file)) fail('css/index.css', `does not import ${file}`);
  }
}

function checkAscii(textFiles, sources) {
  for (const file of textFiles) {
    const source = sources.get(file);
    const fileRel = toPosix(relative(root, file));
    const match = source.match(/[^\x00-\x7f]/);
    if (match) {
      const index = source.indexOf(match[0]);
      const code = match[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
      fail(fileRel, `non-ASCII byte U+${code} at line ${lineOf(source, index)}`);
    }
  }
}

async function fileExists(path) {
  try {
    const info = await stat(path);
    return info.isFile();
  } catch {
    return false;
  }
}

async function checkFontUrls(cssFiles, sources) {
  for (const file of cssFiles) {
    const source = sources.get(file);
    const fileRel = toPosix(relative(root, file));
    const faceRe = /@font-face\s*\{([\s\S]*?)\}/g;
    let face;
    while ((face = faceRe.exec(source)) !== null) {
      const urlRe = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
      let url;
      while ((url = urlRe.exec(face[1])) !== null) {
        const target = url[2].trim();
        if (target.startsWith('data:')) continue;
        const path = target.startsWith('/')
          ? join(root, target)
          : resolve(dirname(file), target);
        if (!(await fileExists(path))) {
          fail(fileRel, `@font-face url(${target}) points at a missing file`);
        }
      }
    }
  }
}

async function checkSpecimenIcons(iconNames) {
  const partsDir = join(root, 'specimen', 'parts');
  const parts = (await walk(partsDir)).filter((file) => extname(file) === '.html');
  for (const file of parts) {
    const source = await readFile(file, 'utf8');
    const fileRel = toPosix(relative(root, file));
    const useRe = /<use\b[^>]*\bhref="([^"]+)"/g;
    let match;
    while ((match = useRe.exec(source)) !== null) {
      const href = match[1];
      const hash = href.indexOf('#');
      if (hash === -1) {
        fail(fileRel, `<use href="${href}"> has no #id`);
        continue;
      }
      const id = href.slice(hash + 1);
      if (!iconNames.has(id)) {
        fail(fileRel, `<use href="${href}"> references unknown icon "${id}"`);
      }
    }
  }
}

async function main() {
  const allFiles = await walk(root);
  const textFiles = allFiles.filter(isTextFile);

  const sources = new Map();
  for (const file of textFiles) {
    sources.set(file, await readFile(file, 'utf8'));
  }

  const cssFiles = allFiles.filter((file) => extname(file) === '.css');
  const cssSources = new Map();
  for (const file of cssFiles) {
    if (!sources.has(file)) sources.set(file, await readFile(file, 'utf8'));
    cssSources.set(file, sources.get(file));
  }

  checkTokens(cssFiles, cssSources);
  checkAscii(textFiles, sources);
  await checkFontUrls(cssFiles, cssSources);

  const indexSource = sources.get(join(root, 'css', 'index.css'));
  if (!indexSource) {
    fail('css/index.css', 'missing');
  } else {
    const componentDir = join(root, 'css', 'components');
    let componentFiles = [];
    try {
      componentFiles = (await readdir(componentDir, { withFileTypes: true }))
        .filter((entry) => entry.isFile() && entry.name.endsWith('.css'))
        .map((entry) => entry.name)
        .sort();
    } catch {
      fail('css/components', 'missing');
    }
    checkComponentImports(indexSource, componentFiles);
  }

  const iconNames = new Set(
    allFiles
      .filter((file) => file.startsWith(join(root, 'icons') + sep) && file.endsWith('.svg'))
      .map((file) => file.slice(file.lastIndexOf(sep) + 1, -'.svg'.length)),
  );
  if (iconNames.size === 0) fail('icons/', 'contains no .svg files');
  await checkSpecimenIcons(iconNames);

  if (failures.length > 0) {
    for (const failure of failures) console.error(`verify: ${failure}`);
    console.error(`verify: ${failures.length} failure(s)`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `verify: ok (${cssFiles.length} CSS files, ${iconNames.size} icons, ${textFiles.length} text files)`,
  );
}

main().catch((error) => {
  console.error(`verify: ${error.stack || error.message}`);
  process.exitCode = 1;
});
