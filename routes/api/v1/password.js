var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/api/v1/password", function (req, res, next) {
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
