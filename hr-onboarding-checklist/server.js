// server.js
const path = require('path');
const express = require('express');
const jsonServer = require('json-server');

const app = express();
const buildPath = path.join(__dirname, 'build');

// 1) Serve React build assets first
app.use(express.static(buildPath));

// 2) JSON‑Server API on root: /employees, /tasks, etc.
app.use(jsonServer.defaults());
app.use(jsonServer.router(path.join(__dirname, 'db.json')));

// 3) For any other route, serve index.html (SPA fallback)
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// 4) Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
