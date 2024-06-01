require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const cors = require('cors');
const { InputError } = require('../exceptions/InputError');

(async () => {
  const app = express();
  const port = process.env.PORT || 8085;

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Middleware untuk memeriksa ukuran payload
  app.use((req, res, next) => {
    if (req.headers['content-length'] > 5000000) {
      return res.status(413).json({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
    }
    next();
  });

  const model = await loadModel();
  app.locals.model = model;

  app.use(routes);

  app.listen(port, () => {
    console.log(`Server start at: http://localhost:${port}`);
  });
})();
