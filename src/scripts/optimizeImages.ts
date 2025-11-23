// src/scripts/optimizeImages.ts
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distImageDir = path.resolve(__dirname, '../../dist/assets/images');

async function walkImages(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkImages(fullPath)));
    } else if (entry.isFile() && /\.(png|jpe?g|webp)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function compressFile(filePath: string): Promise<void> {
  const image = sharp(filePath);
  const metadata = await image.metadata();

  if (metadata.format === 'png') {
    const buffer = await image
      .png({
        compressionLevel: 9,
        palette: true,
        quality: 80,
      })
      .toBuffer();
    await fs.writeFile(filePath, buffer);
  } else if (metadata.format === 'jpeg') {
    const buffer = await image
      .jpeg({
        quality: 80,
        mozjpeg: true,
      })
      .toBuffer();
    await fs.writeFile(filePath, buffer);
  } else if (metadata.format === 'webp') {
    const buffer = await image
      .webp({
        quality: 80,
      })
      .toBuffer();
    await fs.writeFile(filePath, buffer);
  }
}

async function main(): Promise<void> {
  try {
    await fs.access(distImageDir).catch(async () => {
      console.log('dist/assets/images が存在しないため、画像最適化はスキップしました。');
      process.exit(0);
    });

    const files = await walkImages(distImageDir);
    if (files.length === 0) {
      console.log('圧縮対象の画像が見つかりませんでした。');
      return;
    }

    console.log(`Found ${files.length} image(s). Optimizing...`);
    for (const file of files) {
      await compressFile(file);
      console.log(`optimized: ${path.relative(distImageDir, file)}`);
    }

    console.log('Image optimization completed.');
  } catch (err) {
    console.error('Image optimization failed:', err);
    process.exit(1);
  }
}

main();
