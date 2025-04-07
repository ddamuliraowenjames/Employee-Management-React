// server.js
const path = require('path');
const express = require('express');
const jsonServer = require('json-server');

const app = express();

// 1) JSON‑Server on root: /employees, /tasks, etc.
app.use(jsonServer.defaults());
app.use(jsonServer.router(path.join(__dirname, 'db.json')));

// 2) Serve React build
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// 3) Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
