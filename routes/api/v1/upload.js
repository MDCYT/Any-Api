var express = require("express");
var router = express.Router();

const https = require("https");
const fs = require("fs");
const path = require("path");

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
      path.join(__basedir, `public/img/uploads`, rename)
    );
    https.get(url, function (response) {
      response.pipe(file);

      file.on("finish", function () {
        file.close();
        console.log("File downloaded");
      });
    });

    //Check every folder in the uploads folder and check if the folder is older than 7 day
    fs.readdir(path.join(__basedir, `public/img/uploads/`), (err, files) => {
      if (err) {
        console.log(err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(__basedir, `public/img/uploads/${file}`);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(err);
            return;
          }

          const fileDate = new Date(stats.birthtime);
          const now = new Date();
          const diff = now.getTime() - fileDate.getTime();
          const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

          if (diffDays > 7) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log(`${file} was deleted`);
            });
          }
        });
      });
    });


    res.status(200).json({
      message: "File uploaded",
      name: rename,
      url: `https://${req.headers.host}/img/uploads/${rename}`,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      status: 500,
    });
  }
});

module.exports = router;
