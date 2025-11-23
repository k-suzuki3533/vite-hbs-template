// src/scripts/convertAssetPaths.ts
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../../dist');

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
  const htmlFiles = await walkHtml(distDir);

  for (const file of htmlFiles) {
    let content = await fs.readFile(file, 'utf8');
    const rel = path.relative(distDir, file);
    const depth = rel.split(path.sep).length - 1;
    const prefix = depth === 0 ? '' : '../'.repeat(depth);

    // CSS / JS
    content = content.replace(
      /href="\/assets\/([^"?]+\.css)(?:\?[^"]*)?"/g,
      (_m, assetPath: string) => `href="${prefix}assets/${assetPath}"`
    );
    content = content.replace(
      /src="\/assets\/([^"?]+\.js)(?:\?[^"]*)?"/g,
      (_m, assetPath: string) => `src="${prefix}assets/${assetPath}"`
    );

    // "/" へのリンク
    content = content.replace(/<a(\s+[^>]*?)href="\/"(?![^>]*>)/g, (_m, attrs: string) => {
      const href = prefix === '' ? './' : prefix;
      return `<a${attrs}href="${href}"`;
    });

    // 他のパス "/xxx"（/assets は除外）
    content = content.replace(
      /<a(\s+[^>]*?)href="\/(?!assets\/)([^"]*)"/g,
      (_m, attrs: string, linkPath: string) => `<a${attrs}href="${prefix}${linkPath}"`
    );

    await fs.writeFile(file, content, 'utf8');
    console.log(`updated paths: ${rel}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
