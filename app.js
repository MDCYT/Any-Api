const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fs = require("fs");
const app = express();
global.__basedir = __dirname;

const db = require("./utils/db");
global.db = db;

const schedule = require("node-schedule");

const Day = new Date();
//Obtain the date in the format YYYY-MM-DD
const date =
  Day.getFullYear() + "-" + (Day.getMonth() + 1) + "-" + Day.getDate();

//Check if the date is already in the database
const row = db.petitions.selectToday.get(date);
if (!row) {
  //Create a table with all petitions for every day
  db.petitions.insertRow.run(date, 0);
}

//Every day at midnight, create a new table for the next day
schedule.scheduleJob("0 0 0 * * *", function () {
  const Day = new Date();
  //Obtain the date in the format YYYY-MM-DD
  const date =
    Day.getFullYear() + "-" + (Day.getMonth() + 1) + "-" + (Day.getDate() + 1);

  //Check if the date is already in the database
  const newrow = db.petitions.selectToday.get(date);
  //If the date is not in the database, insert it
  if (!newrow) {
    //Create a table with all petitions for every day
    db.petitions.insertRow.run(date, 0);
  }
});

require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"],
});

//Make __basedir available globally
global.__basedir = __dirname;

//Read the router file
const routes = require("./utils/router");
for (const route in routes) {
  app.use(routes[route]);
}

//Home page
app.use("/", require("./routes/index"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  (res.locals.error = req.app.get("env") === "development" ? err : {}),
    // render the error page
    res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
