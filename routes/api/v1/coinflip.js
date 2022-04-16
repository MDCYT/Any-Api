var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/api/v1/coinflip", function (req, res, next) {
  const Day = new Date();
  const date =
    Day.getFullYear() + "-" + (Day.getMonth() + 1) + "-" + Day.getDate();
  try {
    const options = ["heads", "tails"];
    const random = Math.floor(Math.random() * options.length);
    const result = options[random];
    res.status(200).json({
      message: "OK",
      result,
      status: 200,
    });

    //Insert a new petition
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
