#!/usr/bin/env node
/*
 * Prints the CHANGELOG.md section for a version, for `gh release create --notes-file`.
 * Usage: node scripts/release-notes.mjs 0.1.0
 * Exits 1 when the section is missing.
 */
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const changelog = join(root, 'CHANGELOG.md');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main() {
  const version = process.argv[2];
  if (!version) {
    console.error('release-notes: usage: node scripts/release-notes.mjs <version>');
    process.exitCode = 1;
    return;
  }

  let source;
  try {
    source = await readFile(changelog, 'utf8');
  } catch {
    console.error(`release-notes: ${changelog} is missing`);
    process.exitCode = 1;
    return;
  }

  const heading = new RegExp(`^## \\[${escapeRegExp(version)}\\].*$`, 'm');
  const match = source.match(heading);
  if (!match) {
    console.error(`release-notes: no "## [${version}]" section in CHANGELOG.md`);
    process.exitCode = 1;
    return;
  }

  const start = match.index + match[0].length;
  const rest = source.slice(start);
  const next = rest.search(/^##\s/m);
  const section = (next === -1 ? rest : rest.slice(0, next)).trim();

  if (section.length === 0) {
    console.error(`release-notes: the "## [${version}]" section is empty`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`${section}\n`);
}

main().catch((error) => {
  console.error(`release-notes: ${error.stack || error.message}`);
  process.exitCode = 1;
});
