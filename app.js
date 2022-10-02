const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 7070;
const app = express();
// Local
const { apiController } = require('./routes');

app.use(bodyParser.json());

app.use('/api', apiController);
app.get('/', (req, res) => {
  res.send('<h1>HELLO WORLD</h1>');
});

app.listen(PORT, () => console.log(`App run on port: ${PORT}`));
