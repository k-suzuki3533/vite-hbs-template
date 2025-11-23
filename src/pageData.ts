import type { PageDataEntry } from "./types/pageData";

export const pageData: Record<string, PageDataEntry> = {
  "/index.html": {
    pageTitle: "トップページ",
    heroTitle: "Vite + Handlebars テンプレート",
    features: [
      { title: "高速な開発", text: "Vite による高速な HMR とビルド。" },
      { title: "テンプレート", text: "Handlebars でヘッダーやセクションを共通化。" },
      { title: "静的サイト向け", text: "二次受けの静的コーディングに最適化。" }
    ]
  },
  "/about/index.html": {
    pageTitle: "会社概要",
    members: [
      { name: "山田 太郎", role: "Designer" },
      { name: "佐藤 花子", role: "Frontend Engineer" }
    ]
  },
  "/contact/index.html": {
    pageTitle: "お問い合わせ"
  }
};
