const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/api', function(req, res, next) {

  res.json({
    message: 'Welcome to the API',
  });
});

module.exports = router;
