var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api/v1/decodebase64', function(req, res, next) {
    const Day = new Date();
    const date =
      Day.getFullYear() + "-" + (Day.getMonth() + 1) + "-" + Day.getDate();
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
        //Convert base64 to text
        let base64 = Buffer.from(text, "base64").toString("ascii");
        res.status(200).json({
            message: "OK",
            text,
            base64,
            status: 200
        });

            //Insert a new petition

} catch(err) {
    res.status(500).json({
        message: "Internal Server Error",
        status: 500
    });
}
});

module.exports = router;
