var express = require("express");
var router = express.Router();
const fs = require("fs");

/* GET wink API. */
router.get("/api/v1/wink", function (req, res, next) {try {
    let image;

    let winks = fs.readdirSync("./public/img/wink");
    image = winks[Math.floor(Math.random() * winks.length)];
    image = req.protocol + "://" + req.get("host") + "/img/wink/" + image;

    res.status(200).json({
      message: "OK",
      image,
      status: 200,
    });

    //Insert a new petition
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
      status: 500,
    });
  }
});

module.exports = router;
