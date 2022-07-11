const express = require("express");
const router = express.Router();

/* GET docs page. */
router.get("/docs", function (req, res, next) {
    res.redirect("https://docs.api.any-bot.tech/");
});

module.exports = router;
