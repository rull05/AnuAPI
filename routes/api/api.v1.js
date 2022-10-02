const { Router } = require('express');
const { renderHTML } = require('../../controllers/api/api.v1');
const { STATUS_CODES } = require('http');

const router = Router();

router.post('/htmlrender', async (req, res) => {
  console.log(req.body);
  const { html, option } = req.body;
  if (!html) {
    res.status(422);
    return res.send({ msg: "Missing 'html'", status: STATUS_CODES[422] });
  }
  const buffer = await renderHTML(html, option);
  res.status(200);
  res.contentType('image/png');
  res.send(buffer);
});

router.get('/', (req, res) => {
  res.send('API v1');
});
module.exports = router;
