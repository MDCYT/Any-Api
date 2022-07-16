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

/* GET password page. */
router.get("/api/v1/password", limiter, function (req, res, next) {
  try {
    let length = req.query.length;
    let note;
    if (!length) {
      length = 10;
    }
    if (length > 200) {
      length = 200;
      note = "The length of the note is limited to 200 characters";
    }
    //Create a random password with the length specified
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*_+-=,./?";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    res.status(200).json({
      message: "OK",
      password,
      note,
      length,
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
