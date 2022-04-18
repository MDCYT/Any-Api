var express = require("express");
var router = express.Router();

const https = require("https");
const fs = require("fs");
const path = require("path");

const db = require("../../../utils/db.js");

/* Post home page. */
router.post("/api/v1/upload", function (req, res, next) {
  try {
    const { name, url, id } = req.query;

    if (!name || !url || !id) {
      res.json({
        message: "Missing parameters",
      });
      return;
    }

    const rename = `${id}_${name}`;

    const file = fs.createWriteStream(
      path.join(__basedir, "public/img/uploads", rename)
    );
    https.get(url, function (response) {
      response.pipe(file);

      file.on("finish", function () {
        file.close();
        console.log("File downloaded");
      });
    });

    res.status(200).json({
      message: "File uploaded",
      name: rename,
      url: `https://${req.headers.host}/img/uploads/${rename}`,
    });

    db.petitions.addPetition.run(date);
  } catch (err) {
    db.petitions.addInvalidPetition.run(date);

    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
      status: 500,
    });
  }
});

module.exports = router;
