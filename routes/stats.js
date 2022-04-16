var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/stats', function(req, res, next) {
  const petitions = db.petitions.selectLast.get().petitions || 0;
  const petitions_unavailable = db.petitions.selectLast.get().invalids_petitions || 0
  res.json({
    petitions,
    petitions_unavailable,
    all: petitions + petitions_unavailable
  })
});

module.exports = router;
