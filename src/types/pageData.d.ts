// src/types/pageData.d.ts
export interface Feature {
  title: string;
  text: string;
}

export interface Member {
  name: string;
  role: string;
}

export interface PageDataEntry {
  pageTitle: string;
  heroTitle?: string;
  features?: Feature[];
  members?: Member[];
}
