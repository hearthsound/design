#!/usr/bin/env node
/*
 * Builds specimen/index.html (not published) from specimen/parts/<file>.html.
 * Parts are concatenated in css/index.css order; each is rendered twice, in a
 * light column (data-scheme="light") and a dark column (data-scheme="dark").
 * The page links ../css/index.css and the built ../dist/icons.svg sprite.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const partsDir = join(root, 'specimen', 'parts');
const outDir = join(root, 'specimen');
const outFile = join(outDir, 'index.html');

function fail(message) {
  console.error(`specimen: ${message}`);
  process.exitCode = 1;
}

async function buildOrder() {
  const index = await readFile(join(root, 'css', 'index.css'), 'utf8');
  const order = [];
  const re = /@import\s+(?:url\()?['"]components\/([^'")]+)\.css['"]\)?/g;
  let match;
  while ((match = re.exec(index)) !== null) order.push(match[1]);
  return order;
}

function indent(fragment) {
  return fragment
    .trim()
    .split('\n')
    .map((line) => (line.length > 0 ? `  ${line}` : line))
    .join('\n');
}

const pageStyles = `
    html,
    body {
      margin: 0;
      background: var(--hs-window-bg);
      color: var(--hs-fg);
    }

    .specimen {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: start;
    }

    .specimen__col {
      min-width: 0;
      padding: 24px;
      background: var(--hs-view-bg);
      color: var(--hs-fg);
    }

    .specimen__col + .specimen__col {
      box-shadow: inset 1px 0 0 var(--hs-separator);
    }

    .specimen__label {
      margin: 0 0 20px;
      font: 600 11px var(--hs-font-body);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--hs-fg-muted);
    }

    @media (max-width: 720px) {
      .specimen {
        grid-template-columns: minmax(0, 1fr);
      }

      .specimen__col + .specimen__col {
        box-shadow: inset 0 1px 0 var(--hs-separator);
      }
    }
`;

async function main() {
  const order = await buildOrder();
  if (order.length === 0) {
    fail('css/index.css imports no components');
    return;
  }

  let available = [];
  try {
    available = (await readdir(partsDir)).filter((name) => name.endsWith('.html'));
  } catch {
    fail('specimen/parts/ is missing');
    return;
  }

  const parts = [];
  for (const name of order) {
    const file = `${name}.html`;
    if (!available.includes(file)) {
      fail(`specimen/parts/${file} is missing (component order comes from css/index.css)`);
      continue;
    }
    const fragment = await readFile(join(partsDir, file), 'utf8');
    parts.push({ name, fragment });
  }

  if (process.exitCode) return;

  const extra = available.filter((file) => !order.includes(file.slice(0, -'.html'.length)));
  for (const file of extra) {
    console.log(`specimen: note: specimen/parts/${file} is not in css/index.css order and is skipped`);
  }

  const body = parts.map(({ fragment }) => indent(fragment)).join('\n\n');

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hearthsound design specimen</title>
    <link rel="stylesheet" href="../css/index.css">
    <style>${pageStyles}    </style>
  </head>
  <body>
    <div class="specimen">
      <section class="specimen__col" data-scheme="light" aria-label="Light scheme">
        <p class="specimen__label">Light</p>
${body}
      </section>
      <section class="specimen__col" data-scheme="dark" aria-label="Dark scheme">
        <p class="specimen__label">Dark</p>
${body}
      </section>
    </div>
  </body>
</html>
`;

  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, html, 'utf8');
  console.log(`specimen: wrote specimen/index.html from ${parts.length} parts`);
}

main().catch((error) => {
  console.error(`specimen: ${error.stack || error.message}`);
  process.exitCode = 1;
});
