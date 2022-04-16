var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/support', function(req, res, next) {
    res.status(301).redirect("https://discord.gg/nYY4sCWPs2");
});

module.exports = router;
