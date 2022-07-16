var express = require("express");
var router = express.Router();
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
          return 200;
        case 1:
          return 2000;
        case 2:
          return 20000;
        case 3:
          return 200000;
        default:
          return 200;
      }
    }
    return 200;
  },
  message: {
    error: "You have exceeded the rate limit",
    status: 429,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* GET decodebinary page. */
router.get("/api/v1/decodebinary", limiter, function (req, res, next) {
  try {
    let text = req.query.text;
    if (!text) {
      res.status(400).json({
        message: "Bad Request",
        status: 400,
        error: "text is required",
        example: "?text=HelloWorld",
      });
      return;
    }
    //binary to text
    let binary = text
      .split(" ")
      .map(function (char) {
        return String.fromCharCode(parseInt(char, 2));
      })
      .join("");
    res.status(200).json({
      message: "OK",
      text: binary,
      binary: text,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
      status: 500,
    });
  }
});

module.exports = router;
