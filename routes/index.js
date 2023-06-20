var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {

  res.render("index", {
    title: "Any Api",
    description: "Any Api, the best API for your needs",
    keywords: "Any Api, API, API's, API's for your needs",
    host: req.headers.host,
    protocol: "https",
  });
});

module.exports = router;
