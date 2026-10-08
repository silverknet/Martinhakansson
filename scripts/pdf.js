// @ts-check
import puppeteer from 'puppeteer';

/**
 * Prints the page at `url` to an A4 PDF with headless Chrome.
 * Layout comes from the site's own print stylesheet (@media print, @page),
 * so the PDF matches what the browser's "Print" produces.
 *
 * @param {string} url
 * @returns {Promise<Uint8Array>}
 */
export async function renderPdf(url) {
  const browser = await puppeteer.launch({
    // CI containers often can't use Chrome's sandbox. The page is our own, so this is safe.
    args: process.env.CI ? ['--no-sandbox'] : [],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    return await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
      outline: true,
    });
  } finally {
    await browser.close();
  }
}
