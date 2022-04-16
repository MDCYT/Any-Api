const express = require('express');
const router = express.Router();
const path = require('path');
const db = require(path.join(__basedir, 'utils/db'));

/* GET home page. */
router.get('/api', function(req, res, next) {
  const allPetitions = db.petitions.selectAll.all();
  let CountOfAllPetitions = 0;
  for (let i = 0; i < allPetitions.length; i++) {
    CountOfAllPetitions += allPetitions[i].petitions;
  }

  res.json({
    message: 'Welcome to the API',
    data: {
      Petitions: {
        "Total": CountOfAllPetitions,
        "Today": allPetitions[allPetitions.length-1].petitions,
      }
    }
  });
});

module.exports = router;
