var express = require("express");
var router = express.Router();

const https = require("https");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { join } = require("path");
const { APIKeys } = require(join(__basedir, "utils", "db"));
let isValid = true;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: async (request, response) => {
    if (request.headers.api_key) {
      const tier = await APIKeys.checkTier(request.headers.api_key);
      switch (tier) {
        case 0:
          isValid = false;
          return 1;
        case 1:
          return 15;
        case 2:
          return 120;
        case 3:
          return 360;
        default:
          isValid = false;
          return 1;
      }
    }
    isValid = false;
    return 1;
  },
  message: {
    error: "You have exceeded the rate limit",
    status: 429,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* Post upload page. */
router.post("/api/v1/upload", limiter, function (req, res, next) {
  try {
    if (!req.headers.api_key) {
      res.status(401).json({
        message: "Unauthorized",
        status: 401,
        error: "API_KEY is required",
        example: "API_KEY",
      });
      return;
    }

    if (!isValid) {
      res.status(403).json({
        message: "Forbidden",
        status: 403,
        error: "API_KEY is not valid",
        example: "API_KEY",
      });
      return;
    }

    const { name, url, id } = req.query;

    if (!name || !url || !id) {
      res.json({
        message: "Missing parameters",
      });
      return;
    }

    const rename = `${id}_${name}`;

    const file = fs.createWriteStream(
      path.join(__basedir, `public/uploads`, rename)
    );

    https.get(url, function (response) {
      response.pipe(file);
      file.on("finish", function () {
        file.close();
      });
    });

    //Check every folder in the uploads folder and check if the folder is older than 7 day
    fs.readdir(path.join(__basedir, `public/uploads/`), (err, files) => {
      if (err) {
        console.log(err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(__basedir, `public/uploads/${file}`);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            return;
          }

          const fileDate = new Date(stats.birthtime);
          const now = new Date();
          const diff = now.getTime() - fileDate.getTime();
          const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

          if (diffDays > 7) {
            fs.unlink(filePath, (err) => {
              if (err) {
                return;
              }
            });
          }
        });
      });
    });

    res.status(200).json({
      message: "File uploaded",
      name: rename,
      url: `${req.protocol}://${req.headers.host}/uploads/${rename}`,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      status: 500,
    });
  }
});

module.exports = router;
