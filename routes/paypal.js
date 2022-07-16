var express = require("express");
var router = express.Router();
const { join } = require("path");
const { APIKeys } = require(join(__basedir, "utils", "db"));

const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "live", //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

router.post("/api/payment/paypal", function (req, res, next) {
  const { paymentId, payerId, name, price, typeOfProject, email } = req.body;

  //Check if paymentId and payerId are not empty
  if (paymentId === "" || payerId === "") {
    res.status(400).json({
      message: "Bad Request",
      status: 400,
      error: "paymentId and payerId are required",
      example: "paymentId and payerId",
    });
    return;
  }

  //Check if exist the paymentId in Paypal
  paypal.payment.get(paymentId, function (error, payment) {
    if (error) {
      res.status(500).json({
        message: "Internal Server Error",
        status: 500,
        error: "Error in the request to Paypal",
        example: "paymentId",
      });
      return;
    }

    //Check if the payment is approved
    if (payment.state !== "approved") {
      res.status(400).json({
        message: "Bad Request",
        status: 400,
        error: "The payment is not approved",
        example: "paymentId",
      });
      return;
    }

    //Check if the payment is made by the same payerId
    if (
      payment.transactions[0].related_resources[0].sale.payer.payer_info
        .payer_id !== payerId
    ) {
      res.status(400).json({
        message: "Bad Request",
        status: 400,
        error: "The payment is not made by the same payerId",
        example: "paymentId",
      });
      return;
    }

    let tier = price.toLowerCase();
    //If the payment is approved, create a new API Key
    const apiKey = APIKeys.create({
      name: name,
      tier: tier,
      project: typeOfProject,
      email: email,
    });

    //If the API Key is created, send the API Key to the client
    if (apiKey) res.status(200).redirect("/thanks?yeah=" + apiKey);
    //If the API Key is not created, send an error to the client
    else {
      res.status(500).render("error", {
        error:
          "Error in the request to Paypal, please contact us https://discord.gg/5UyuwbNu8j",
      });
    }
  });
});

module.exports = router;
