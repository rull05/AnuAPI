const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Local
const { apiController } = require('./routes');

const PORT = process.env.PORT || 7070;
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use('/api', apiController);
app.get('/', (req, res) => {
  res.status(200);
  res.send('<h1>HELLO WORLD</h1>');
});

app.listen(PORT, () => console.log(`App run on port: ${PORT}`));
