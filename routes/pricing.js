var express = require("express");
var router = express.Router();

/* GET pricing. */
router.get("/pricing", function (req, res, next) {
  res
    .status(200)
    .render("pricing", {
      title: "API Pricing",
      description: "API Pricing Information",
      keywords:
        "api key, api, api's, api's for your needs, Any Bot, Any Bot API, Any Bot API's, Any Bot API's for your needs, Any Bot API's for your needs",
      host: req.headers.host,
      protocol: req.protocol,
    });
});

module.exports = router;
