const puppeteer = require('puppeteer');

module.exports = async (opt) => {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 20_000,
    ignoreHTTPSErrors: true,
    slowMo: 0,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--window-size=1280,720',
    ],
    ...opt,
  });
  return browser;
};
