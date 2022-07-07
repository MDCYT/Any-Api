var express = require("express");
var router = express.Router();
const fs = require("fs");

/* GET home page. */
router.get("/api/v1/fox", function (req, res, next) {
  try {
    let avalible_options = ["fact", "image", "both"];
    let option = req.query.option;
    if (!option) {
      option = "both";
    }
    if (avalible_options.indexOf(option) == -1) {
      option = "both";
    }

    let image;
    if (option == "both" || option == "image") {
      let bears = fs.readdirSync("./public/img/fox");
      image = bears[Math.floor(Math.random() * bears.length)];
      image = req.protocol + "://" + req.get("host") + "/img/fox/" + image;
    }

    let fact;
    if (option == "both" || option == "fact") {
      let facts = fs.readFileSync("./public/json/foxs-fact.json", "utf8");
      facts = JSON.parse(facts);
      fact = facts[Math.floor(Math.random() * facts.length)];
      //Generate a random number between 0 and 10M
      if (Math.floor(Math.random() * 10000000) == 616) {
        fact = "Hay alguien contigo, no mires atrás";
      }
    }

    res.status(200).json({
      message: "OK",
      image,
      fact,
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
