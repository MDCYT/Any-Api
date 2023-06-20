const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
require("dotenv").config();

require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"],
});


//Make __basedir available globally 
global.__basedir = __dirname;

//Change the X-Powered-By header and set Favicon
app.use(function (req, res, next) {
  res.setHeader("X-Powered-By", "MDCDEV, Discord: https://discord.gg/dae");
  res.setHeader("X-Video", "https://www.youtube.com/watch?v=BTJ7AoyT4Qw");
  res.setHeader("X-Que", "So");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
})

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({
    error: "Not found",
    status: 404
  });
})

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  (res.locals.error = req.app.get("env") === "development" ? err : {}),
    // render the error page
    res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    description: "Ups, you are in the wrong place!",
    keywords: "error, error page, error page for your needs, any api, api, api's, api's for your needs, Any Bot",
    host: req.headers.host,
    protocol: req.protocol,
    error: err.message,
    error_code: err.status
  });
});


module.exports = app;
