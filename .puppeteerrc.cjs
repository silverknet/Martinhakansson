const { join } = require('node:path');

/** @type {import('puppeteer').Configuration} */
module.exports = {
  // Keep the Chrome used for PDF generation inside node_modules, so CI caches
  // that restore node_modules (e.g. Netlify) also restore Chrome.
  cacheDirectory: join(__dirname, 'node_modules', '.cache', 'puppeteer'),
};
