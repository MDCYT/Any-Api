var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/apikey", function (req, res, next) {
  res
    .status(200)
    .render("apikey", {
      title: "API Key",
      description: "Get your API key",
      keywords:
        "api key, api, api's, api's for your needs, Any Bot, Any Bot API, Any Bot API's, Any Bot API's for your needs, Any Bot API's for your needs",
      host: req.headers.host,
      protocol: req.protocol,
      projects: [
        {
          id: "bot",
          name: "Bot",
          description: "Bot for Discord, Twitch, etc."
        },
        {
          id: "webscraper",
          name: "Webscraper",
          description: "Webscraper for APIs, etc."
        },
        {
          id: "api",
          name: "API",
          description: "For APIs, etc."
        },
        {
          id: "website",
          name: "Website",
          description: "Website"
        },
        {
          id: "other",
          name: "Other",
          description: "Other"
        }
      ],
      tiers: [
        {
          id: "free",
          name: "Free",
          price: "Free Forever",
          description: "Free"
        },
        {
          id: "basic",
          name: "Basic",
          price: "1.99$ / month",
          description: "Basic"
        },
        {
          id: "pro",
          name: "Pro",
          price: "4.99$ / month",
          description: "Pro"
        },
        {
          id: "enterprise",
          name: "Enterprise",
          price: "9.99$ / month",
          description: "Enterprise"
        }

      ]
    });
});

module.exports = router;
