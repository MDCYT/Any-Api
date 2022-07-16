const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");
const { join } = require("path");
const { APIKeys } = require(join(__basedir, "utils", "db"));

const limiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 5000,
  message: {
    error: "You have exceeded the rate limit per hour",
    status: 429,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* GET payment page. */
router.get("/payment", limiter, function (req, res, next) {
  let { name, email, price, typeOfProject } = req.query;

  if (!email || !name || !price || !typeOfProject)
    res.status(400).render("error", {
      title: "Error",
      description: "Ups, you are in the wrong place!",
      keywords:
        "error, error page, error page for your needs, any api, api, api's, api's for your needs, Any Bot",
      host: req.headers.host,
      protocol: req.protocol,
      error: "Missing parameters",
      error_code: "400",
    });

  res.status(200).render("payment", {
    title: "Payment",
    description: "Payment page",
    keywords: "payment, payment page, payment page for your needs, Any Bot",
    host: req.headers.host,
    protocol: req.protocol,
    name: req.query.name,
    email: req.query.email,
    price: req.query.price,
    typeOfProject: req.query.typeOfProject,
  });
});

module.exports = router;
