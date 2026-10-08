// Used only at build time (scripts/build.js) to prerender the page to static HTML.
import { render as renderSvelte } from 'svelte/server';
import App from './App.svelte';
import { cv } from './lib/cv';

export const pdfFileName = cv.site.pdfFileName;

export function render() {
  return renderSvelte(App);
}
