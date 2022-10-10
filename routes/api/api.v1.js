const { Router } = require('express');
const { renderHTML } = require('../../controllers/api/api.v1');
const { STATUS_CODES } = require('http');
const getBrowser = require('../../lib/getBrowser');
const puppeteer = require('puppeteer');
const util = require('util');
const syntaxerror = require('syntax-error');

const APIKEY = '@anu-team#123';
const APIKEY_OWNER = 'rull-amat-cuy';

const router = Router();

router.post('/htmlrender', async (req, res) => {
  console.log(req.body);
  const { html, option } = req.body;
  if (!html) {
    res.status(422);
    return res.send({ msg: "Missing 'html'", status: STATUS_CODES[422] });
  }
  const buffer = await renderHTML(html, option);
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': buffer.length,
  });
  res.end(buffer);
});

router.post('/puppeteer', async (req, res) => {
  let browser,
    _return,
    _format = true;
  let { code, browserOpt: opt, apikey, format } = req.body;
  _format = format !== undefined ? format : _format;
  if (!apikey) {
    res.status(403);
    res.end('Missing apikey');
    return;
  }
  if (apikey !== APIKEY) {
    res.status(403);
    res.end('wrong apikey');
    return;
  }
  if (!code) {
    res.status(422);
    res.send('missing code');
  }

  try {
    browser = await getBrowser(opt);
    let f = {
      exports: {},
    };
    let p = { exit: () => 'Bruhhh...' };
    let exec = new (async () => {}).constructor(
      'require',
      'puppeteer',
      'browser',
      'process',
      'module',
      'exports',
      'arguments',
      code
    );
    _return = await exec.call(
      browser,
      (modules) => {
        return modules;
      },
      puppeteer,
      browser,
      p,
      f,
      f.exports,
      [browser]
    );
  } catch (err) {
    if (err) _return = util.format(err.message || 'Error');
  } finally {
    if (Buffer.isBuffer(_return)) res.send(_return);
    else
      res.send({
        result: _format ? util.format(_return) : _return,
      });
    if (browser) await browser.close();
  }
});

router.all('/eval', async (req, res) => {
  let _return;
  let _syntax = '';
  let _format = true;
  let queries;
  if (req.method === 'POST') {
    queries = req.body;
  } else if (req.method === 'GET') {
    queries = req.query;
  } else {
    res.status(405);
    res.send('Method not allowed');
    return;
  }
  let { code, format, apikey } = queries;
  if (!apikey) {
    req.status(403);
    req.send('Missing apikey');
    return;
  }
  if (apikey !== APIKEY_OWNER) {
    req.status(403);
    res.send(`Apikey ${apikey} not available`);
    return;
  }
  if (!code) {
    req.status(422);
    res.send("'code' required");
  }

  _format = format !== undefined ? format : _format;
  try {
    _return = await eval(`;(async () => {${code}})()`);
  } catch (e) {
    let err = await syntaxerror(code, {
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
    });
    if (err) _syntax = err + '\n\n';
    _return = util.format(e);
  } finally {
    Buffer.isBuffer(_return)
      ? res.send(_return)
      : res.send(
          format
            ? _syntax + util.format(_return)
            : _syntax
            ? _syntax + _return
            : _return
        );
  }
});

router.get('/', (req, res) => {
  res.send('API v1');
});
module.exports = router;
