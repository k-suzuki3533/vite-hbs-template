// src/scripts/addTimestamp.ts
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../../dist');

const pad = (n: number) => String(n).padStart(2, '0');

function createTimestamp(): string {
  const now = new Date();
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

async function walkHtml(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkHtml(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main(): Promise<void> {
  const timestamp = createTimestamp();
  const htmlFiles = await walkHtml(distDir);

  for (const file of htmlFiles) {
    let content = await fs.readFile(file, 'utf8');

    content = content.replace(
      /href="([^"?]+\.css)"/g,
      (_m, url: string) => `href="${url}?${timestamp}"`
    );
    content = content.replace(
      /src="([^"?]+\.js)"/g,
      (_m, url: string) => `src="${url}?${timestamp}"`
    );

    await fs.writeFile(file, content, 'utf8');
    console.log(`added timestamp: ${path.relative(distDir, file)}`);
  }

  console.log(`version: ${timestamp}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
