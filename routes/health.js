const express = require('express');
const router = express.Router();

// Route GET /api/health
router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

module.exports = router;
