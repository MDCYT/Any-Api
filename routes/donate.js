const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/donate', function(req, res, next) {
    res.status(200).render('donate', { title: 'Donate', description: 'Help us to keep our website up and running!', keywords: "donate, help, help us, help us keep our website up and running, any api, api, api\'s, api\'s for your needs, Any Bot" });
});

module.exports = router;
