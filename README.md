# vite-hbs-template

Vite + Handlebars + TypeScript + SCSS(FLOCSS) を組み合わせた  
静的サイトコーディング用テンプレートです。

- 複数ページの静的 HTML 生成
- レイアウト・パーツ共通化（Handlebars partial）
- FLOCSS + Sass 構成
- ビルド後に自動処理
  - パスを相対パスに変換
  - JS/CSS に `?YYYYMMDDHHmmss` を付与
  - 画像（PNG/JPEG/WebP）を sharp で圧縮

---

## 環境・利用技術

- Node.js 18+
- Vite
- vite-plugin-handlebars
- TypeScript
- SCSS（FLOCSS 構成）
- ESLint / Stylelint / Prettier
- sharp（画像圧縮）

---

## ディレクトリ構成（抜粋）

```text
vite-hbs-template/
├─ package.json
├─ vite.config.mts
├─ tsconfig.json
├─ stylelint.config.cjs
├─ postcss.config.cjs
├─ src/
│  ├─ pages/                  # ページごとの HTML（Handlebars 記法OK）
│  │  ├─ index.html
│  │  ├─ slug/index.html
│  ├─ components/             # Handlebars パーシャル（レイアウト・セクション等）
│  ├─ assets/
│  │  ├─ styles/
│  │  │  ├─ foundation/       # reset, base, variables
│  │  │  ├─ layout/           # .l-*
│  │  │  ├─ object/
│  │  │  │  ├─ component/     # .c-*
│  │  │  │  ├─ project/       # .p-*
│  │  │  │  └─ utility/       # .u-*
│  │  │  └─ main.scss         # SCSS エントリ
│  │  ├─ scripts/
│  │  │  ├─ modules/          # 共通 JS
│  │  │  ├─ pages/            # ページ別 JS
│  │  │  └─ main.ts           # JS エントリ
│  │  └─ images/              # ページで使う画像（ビルド→圧縮対象）
│  ├─ scripts/                # Node スクリプト（ビルド後処理）
│  ├─ types/                  # 型定義
│  └─ pageData.ts             # 各ページに渡すデータ
├─ public/                    # favicon, robots.txt など（そのまま dist 直下へ）
└─ dist/                      # ビルド出力（納品物）
```

---

## セットアップ

```bash
npm install
```

---

## スクリプト

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && tsx src/scripts/convertAssetPaths.ts && tsx src/scripts/addTimestamp.ts && tsx src/scripts/optimizeImages.ts",
    "preview": "vite preview",
    "lint": "eslint \"src/**/*.{ts,js}\" \"vite.config.mts\"",
    "lint:style": "stylelint \"src/**/*.{css,scss}\"",
    "format": "prettier --write \"**/*.{js,ts,scss,css,html,json,md}\""
  }
}
```

### 開発サーバー

```bash
npm run dev
```

- `http://localhost:5173/` → `src/pages/index.html` を表示

---

## ビルド

```bash
npm run build
```

実行内容:

1. `vite build`

   - `src/pages` → `dist` に HTML / JS / CSS / 画像を出力

2. `convertAssetPaths.ts`

   - `dist/**/*.html` 内のパスを調整

     - `/assets/...` → `assets/...` / `../assets/...` などの相対パスに変換
     - `<a href="/...">` も相対パスに変換
       → サブディレクトリ配備でもリンクが壊れないようにする

3. `addTimestamp.ts`

   - HTML 内の JS/CSS リンクに `?YYYYMMDDHHmmss` を付与

4. `optimizeImages.ts`

   - `dist/assets/images/**/*.{png,jpg,jpeg,webp}` を sharp で圧縮

---

## HTML / Handlebars の使い方

### ページファイル

`src/pages/index.html`（例）

```html
<!doctype html>
<html lang="ja">
  <head>
    {{> LayoutHead }}
  </head>
  <body class="l-body p-home">
    {{> LayoutHeader }}

    <main class="l-main">
      {{> SectionHomeHero }}
      {{> SectionHomeFeatures }}
    </main>

    {{> LayoutFooter }}
  </body>
</html>
```

- `<head> / header / footer` は `src/components` のパーシャルで共通化。
- `body` に `p-home` / `p-about` 等のクラスを付与し、JS 側の初期化条件に使います。

---

### JS エントリ読み込み

`src/components/LayoutHead.html`（例）

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{{pageTitle}} | Vite + Handlebars</title>

<script type="module">
  import '@/assets/scripts/main.ts';
</script>
```

Vite がビルド時に解析し、最終的な HTML では

```html
<script type="module" src="assets/js/main.js?v=..."></script>
```

のように変換されます。

---

## ページデータ（`pageData.ts`）

`src/pageData.ts` で、ページごとのタイトルやリストを定義します。

```ts
import type { PageDataEntry } from './types/pageData';

export const pageData: Record<string, PageDataEntry> = {
  '/index.html': {
    pageTitle: 'トップページ',
    heroTitle: 'Vite + Handlebars テンプレート'
  },
  '/about/index.html': {
    pageTitle: 'About'
  },
  '/contact/index.html': {
    pageTitle: 'Contact'
  }
};
```

`vite.config.mts`:

```ts
handlebars({
  partialDirectory: resolve(__dirname, 'src/components'),
  context(pagePath) {
    return pageData[pagePath as keyof typeof pageData] ?? {};
  }
});
```

テンプレートからは `{{pageTitle}}` などで参照します。

---

## 新しいページを追加する手順

1. HTML 追加
   `src/pages/service/index.html` を作成（`index.html` をコピーして調整）。

2. エントリとして登録
   `vite.config.mts` の `rollupOptions.input` に追加:

   ```ts
   service: resolve(rootDir, 'service/index.html');
   ```

3. ページデータ追加（必要なら）
   `src/pageData.ts` に `/service/index.html` を追加。

4. スタイル・スクリプト（必要なら）

   - `src/assets/styles/object/project/_service.scss` を作成し、`project/_index.scss` に `@forward 'service';` を追加。
   - `src/assets/scripts/pages/service.ts` を作成し、`main.ts` で `p-service` クラスを見て初期化する処理を追加。

5. `npm run dev` / `npm run build` で確認。

---

このテンプレートをベースに、ページやパーツを追加していくことで、
静的コーディング案件をそのまま納品できる構成になります。

```
::contentReference[oaicite:0]{index=0}
```
