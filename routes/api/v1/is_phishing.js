var express = require("express");
var router = express.Router();

const axios = require("axios");
const rateLimit = require("express-rate-limit");
const {
  join
} = require("path");
const followRedirects = require('follow-redirects-fast');

const {
  PhishingDomains
} = require(join(__basedir, "utils", "db"));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: async (request, response) => {
    if (request.headers.api_key) {
      const tier = await APIKeys.checkTier(request.headers.api_key);
      switch (tier) {
        case 0:
          return 15;
        case 1:
          return 30;
        case 2:
          return 120;
        case 3:
          return 360;
        default:
          return 10;
      }
    }
    return 10;
  },
  message: {
    error: "You have exceeded the rate limit",
    status: 429,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* Get Phishing page. */
router.get("/api/v1/is_phishing", limiter, async function (req, res, next) {
  try {

    let {
      domain
    } = req.query;

    if (!domain) {
      return res.status(400).json({
        error: "Missing domain",
        status: 400,
      });
    }

    const regex = /(?:(?:https?|ftp|mailto):\/\/)?(?:www\.)?(([^\/\s]+\.[a-z\.]+)(\/[^\s]*)?)(?:\/)?/ig;

    let susDomainsArgs = [];

    for await (let match of domain.matchAll(regex)) {
      susDomainsArgs.push(match[1]);
      susDomainsArgs.push(match[2]);
      //Check in axios if the url is http or https
      let url;
      try {
        await axios.get('https://' + match[1]).then(res => {
          //If return 200, 301, 302, is a valid url, if not, is not valid
          if (res.status === 200 || res.status === 301 || res.status === 302) {
            url = 'https://' + match[1];
          }
        })
      } catch (err) {
        url = err.request.host ? 'https://' + match[1] : null;
        if (url === null) {
          try {
            await axios.get('http://' + match[1]).then(res => {
              //If return 200, 301, 302, is a valid url, if not, is not valid
              if (res.status === 200 || res.status === 301 || res.status === 302) {
                url = 'http://' + match[1];
              }
            })
          } catch (err) {
            url = err.request.host ? 'http://' + match[1] : null;
          }
        }

      }
      if (url !== null) {

        await followRedirects({
          url: url,
          maxRedirects: 20,
          timeout: 10000
        }).then(async (res) => {
          //Regex to get the domain
          const lasturl = res.lastURL
          for (let match of lasturl.matchAll(regex)) {
            susDomainsArgs.push(match[1]);
            susDomainsArgs.push(match[2]);
          }
        }).catch(async (err) => {
          return match[1];
        })
      }
    }

    // Check if the message contains a phishing link
    // PhishingLinks have a property called "domains", which is an array of domains
    // If the message contains a phishing link, the bot will send a message to the mod channel
    for await (let susDomain of susDomainsArgs) {


      if (await PhishingDomains.getPhishingDomain({
          domain: susDomain
        })) {
        return res.status(200).json({
          message: "Domain is a phishing domain",
          status: 200,
          isPhishing: true,
        });
      }

      if (await PhishingDomains.getPhishingDomain({
          domain: susDomain.toLowerCase()
        })) {
        return res.status(200).json({
          message: "Domain is a phishing domain",
          status: 200,
          isPhishing: true,
        });
      }
    }

    return res.status(200).json({
      message: "Domain is not a phishing domain",
      status: 200,
      isPhishing: false,
    });

  } catch (err) {

    return res.status(500).json({
      message: "Internal Server Error",
      status: 500
    });

  }

});

module.exports = router;