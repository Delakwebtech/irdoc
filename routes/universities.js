const express = require('express');
const {
  getUniversities,
  getPolytechnics,
  getUniversitiesByState,
} = require('../controller/university');

const router = express.Router();

router.get('/institutions/universities', getUniversities);
router.get('/institutions/polytechnics', getPolytechnics);
router.get('/institutions/:stateId', getUniversitiesByState);

module.exports = router;
