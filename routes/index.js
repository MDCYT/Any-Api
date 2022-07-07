var express = require("express");
var router = express.Router();
const fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  const bears = fs.readdirSync("./public/img/bear");
  let bear = bears[Math.floor(Math.random() * bears.length)];

  bear = "img/bear/" + bear;

  const dogs = fs.readdirSync("./public/img/dog");
  let dog = dogs[Math.floor(Math.random() * dogs.length)];

  dog = "img/dog/" + dog;

  const cats = fs.readdirSync("./public/img/cat");
  let cat = cats[Math.floor(Math.random() * cats.length)];

  cat = "img/cat/" + cat;

  const birds = fs.readdirSync("./public/img/bird");
  let bird = birds[Math.floor(Math.random() * birds.length)];

  bird = "img/bird/" + bird;

  res.render("index", {
    title: "Any Api",
    description: "Any Api, the best API for your needs",
    keywords: "Any Api, API, API's, API's for your needs",
    bear,
    dog,
    cat,
    bird
  });
});

module.exports = router;
