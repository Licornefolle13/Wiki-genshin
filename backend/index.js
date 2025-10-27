const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// middleware
const { requestLogger, errorLogger } = require('./middleware/logger');
app.use(requestLogger);

// routes
app.use('/api', require('./routes'));

// error logger and handler
app.use(errorLogger);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'internal_error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
