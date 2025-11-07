const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static assets placed in backend/genshin (e.g. character card images)
app.use('/genshin', express.static(path.join(__dirname, 'genshin')));

// Dynamic image map endpoint
app.get('/genshin/images.json', async (req, res, next) => {
  try {
    const dir = path.join(__dirname, 'genshin');
    const files = await fs.readdir(dir);
    const map = {};

    const sanitize = (name) =>
      name
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '_');

    for (const file of files) {
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      // remove trailing _Card if present
      const nameBase = base.replace(/_Card$/i, '');
      const keyFull = sanitize(nameBase);
      map[keyFull] = `/genshin/${file}`;

      // also map last token after underscore (e.g., Arataki_Itto -> Itto)
      const parts = nameBase.split(/[_\s]+/);
      if (parts.length > 1) {
        const keyLast = sanitize(parts[parts.length - 1]);
        if (!map[keyLast]) map[keyLast] = `/genshin/${file}`;
      }
    }

    res.json(map);
  } catch (err) {
    next(err);
  }
});

// middleware
const { requestLogger, errorLogger } = require('./middleware/logger');
app.use(requestLogger);

// serve static images from genshin folder
const imagesPath = process.env.IMAGES_PATH || path.join(__dirname, '..', 'genshin');
app.use('/images', express.static(imagesPath));

// routes
app.use('/api', require('./routes'));

// error logger and handler
app.use(errorLogger);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'internal_error' });
});

const port = process.env.PORT || 4000;
const host = process.env.BIND_HOST || '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Backend listening on http://${host === '0.0.0.0' ? 'localhost' : host}:${port} (bound to ${host})`);
});
