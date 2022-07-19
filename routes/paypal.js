var express = require("express");
var router = express.Router();
const axios = require("axios");
const {
  PAYPAL_URL,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  BASIC_PLAN_ID,
  PRO_PLAN_ID,
  ENTERPRISE_PLAN_ID,
} = process.env;

router.get("/buy", async function (req, res, next) {
  let { name, email, price, project } = req.query;
  let date = new Date();
  //the date add one day to the current date
  date = new Date(date.setDate(date.getDate() + 1));
  //convert to 2018-11-01T00:00:00Z format, if is one digit add 0 before
  let dateString = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}T${
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
  }Z`;

  const name_url = encodeURIComponent(name);
  const email_url = encodeURIComponent(email);
  const price_url = encodeURIComponent(price);
  const project_url = encodeURIComponent(project);

  let plan_id;

  if (price === "Basic") {
    plan_id = BASIC_PLAN_ID;
  } else if (price === "Pro") {
    plan_id = PRO_PLAN_ID;
  } else if (price === "Enterprise") {
    plan_id = ENTERPRISE_PLAN_ID;
  }

  const order = {
    plan_id: plan_id,
    start_time: dateString,
    quantity: 1,

    application_context: {
      shipping_preference: "NO_SHIPPING",
      payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
      user_action: "SUBSCRIBE_NOW",
      brand_name: "Any API",
      landing_page: "LOGIN",
      return_url: req.protocol + "://" + req.headers.host + "/thanks?name=" + name_url + "&email=" + email_url + "&price=" + price_url + "&project=" + project_url,
      cancel_url: req.protocol + "://" + req.headers.host + "/cancel",
    },
  };

  const token = await axios
    .post(
      PAYPAL_URL + "/v1/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPAL_CLIENT_ID,
          password: PAYPAL_CLIENT_SECRET,
        },
      }
    )
    .then((response) => {
      return response.data.access_token;
    })
    .catch((error) => {
      console.log(error);
    });

  const response = await axios.post(
    `${PAYPAL_URL}/v1/billing/subscriptions`,
    order,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    return response.data;
  }
  ).catch((error) => {
    console.log(error.response.data);
  })

  res.redirect(response.links[0].href);
});

module.exports = router;
