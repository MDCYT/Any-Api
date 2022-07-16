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

/* GET hug API. */
router.get("/api/v1/hug", limiter, function (req, res, next) {
  try {
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
