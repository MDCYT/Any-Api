var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api/v1/decodebinary', function(req, res, next) {
    try{
        let text = req.query.text;
        if(!text) {
            res.status(400).json({
                message: "Bad Request",
                status: 400,
                error: "text is required",
                example: "?text=HelloWorld"
            });
            return;
        }
        //binary to text
        let binary = text.split(" ").map(function(char) {
            return String.fromCharCode(parseInt(char, 2));
        }
        ).join("");
        res.status(200).json({
            message: "OK",
            text,
            binary,
            status: 200
        });

} catch(err) {
    console.log(err);
    res.status(500).json({
        message: "Internal Server Error",
        status: 500
    });
}
});

module.exports = router;
