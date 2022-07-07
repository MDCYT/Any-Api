var express = require("express");
var router = express.Router();
const fs = require("fs");

/* GET pat API. */
router.get("/api/v1/pat", function (req, res, next) {try {
    let image;

    let pats = fs.readdirSync("./public/img/pat");
    image = pats[Math.floor(Math.random() * pats.length)];
    image = req.protocol + "://" + req.get("host") + "/img/pat/" + image;

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
