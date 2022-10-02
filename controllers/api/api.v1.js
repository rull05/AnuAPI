const getBrowser = require('../../lib/getBrowser');
const { STATUS_CODES } = require('http');
const fs = require('fs/promises');

module.exports = {
  async renderHTML(html, opt = { viewport: {} }) {
    let buffer;
    const browser = await getBrowser();
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 720, ...opt.viewport });
      await page.setContent(html);
      buffer = await page.screenshot();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (browser) await browser.close();
    }
    return buffer;
  },
  async screenshotPage(url, opt = { viewport: {} }) {
    let buffer;
    const browser = await getBrowser();
    try {
      const page = await browser.newPage();
      await page.setViewport({
        width: 1280,
        height: 720,
        ...opt.viewport,
      });
      await page.goto(url);
      buffer = await page.screenshot();
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (browser) await browser.close();
    }
    return buffer;
  },
};
