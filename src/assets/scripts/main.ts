// src/assets/scripts/main.ts
import '../styles/style.scss';

import { domReady } from './modules/domReady';
import { initHomePage } from './pages/home';
import { initAboutPage } from './pages/about';
import { initContactPage } from './pages/contact';

domReady(() => {
  const body = document.body;

  if (body.classList.contains('p-home')) {
    initHomePage();
  }

  if (body.classList.contains('p-about')) {
    initAboutPage();
  }

  if (body.classList.contains('p-contact')) {
    initContactPage();
  }
});
