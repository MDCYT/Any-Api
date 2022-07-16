var express = require("express");
var router = express.Router();


router.get("/thanks", function (req, res, next) {
    let {yeah} = req.query;
    if(!yeah || yeah === "") res.redirect("/");
    res.render("thanks", {
        title: "Thanks for your payment",
        message: "Your payment has been processed successfully",
        keywords: "donate, help, help us, help us keep our website up and running, any api, api, api's, api's for your needs, Any Bot",
        host: req.headers.host,
        protocol: req.protocol,
        apiKey: req.query.apiKey,
    })
})

module.exports = router;