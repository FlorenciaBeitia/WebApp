// Main server entry point
// Loads environment, connects to MongoDB and starts Express server (HTTP or HTTPS if certs provided)

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/webapp';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

// Serve static frontend
app.use('/', express.static(path.join(__dirname, 'public')));

// Optional HTTPS support: if SSL_KEY_PATH and SSL_CERT_PATH are provided and files exist,
// start an HTTPS server. Otherwise, default to HTTP.
const PORT = process.env.PORT || 3000;
const sslKeyPath = process.env.SSL_KEY_PATH;
const sslCertPath = process.env.SSL_CERT_PATH;

if (sslKeyPath && sslCertPath && fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
  const options = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath),
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
  });
} else {
  // HTTP fallback (use a reverse proxy or supply certs in production)
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
    if (!sslKeyPath || !sslCertPath) {
      console.log('SSL_KEY_PATH or SSL_CERT_PATH not provided; running without HTTPS. For production, enable HTTPS or use a reverse proxy.');
    }
  });
}
