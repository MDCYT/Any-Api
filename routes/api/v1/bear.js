var express = require("express");
var router = express.Router();
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const { join } = require("path");
const { APIKeys } = require(join(__basedir, "utils", "db"));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: async (request, response) => {
    if (request.headers.api_key) {
      const tier = await APIKeys.checkTier(request.headers.api_key);
      switch (tier) {
        case 0:
          return 30;
        case 1:
          return 120;
        case 2:
          return 360;
        case 3:
          return 920;
        default:
          return 30;
      }
    }
    return 30;
  },
  message: {
    error: "You have exceeded the rate limit",
    status: 429,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* GET bear fact and image. */
router.get("/api/v1/bear", limiter, function (req, res, next) {
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
      let bears = fs.readdirSync("./public/img/bear");
      image = bears[Math.floor(Math.random() * bears.length)];
      image = req.protocol + "://" + req.get("host") + "/img/bear/" + image;
    }

    let fact;
    if (option == "both" || option == "fact") {
      let facts = fs.readFileSync("./public/json/bears-fact.json", "utf8");
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
