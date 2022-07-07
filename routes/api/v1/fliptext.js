var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/api/v1/fliptext", function (req, res, next) {
  const Day = new Date();
  const date =
    Day.getFullYear() + "-" + (Day.getMonth() + 1) + "-" + Day.getDate();
  try {
    const text = req.query.text;
    if (!text) {
      res.status(400).json({
        message: "Bad Request",
        status: 400,
        error: "text is required",
        example: "?text=HelloWorld",
      });
      return;
    }
    //text flipped backwards
    let flipped = text.split("").reverse().join("");
    res.status(200).json({
      message: "OK",
      text,
      flipped,
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
