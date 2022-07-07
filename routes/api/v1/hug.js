var express = require("express");
var router = express.Router();
const fs = require("fs");

/* GET hug API. */
router.get("/api/v1/hug", function (req, res, next) {try {
    let image;

    let hugs = fs.readdirSync("./public/img/hug");
    image = hugs[Math.floor(Math.random() * hugs.length)];
    image = req.protocol + "://" + req.get("host") + "/img/hug/" + image;

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
