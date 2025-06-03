const express = require('express');
const {
  getUniversities,
  getPolytechnics,
  getColleges,
  getHealthSciences,
  getOtherInstitutions,
  // getUniversitiesByState,
} = require('../controller/university');

const router = express.Router();

router.get('/institutions/universities', getUniversities);
router.get('/institutions/polytechnics', getPolytechnics);
router.get('/institutions/colleges', getColleges);
router.get('/institutions/health', getHealthSciences);
router.get('/institutions/others', getOtherInstitutions);
// router.get('/institutions/:stateId', getUniversitiesByState);

module.exports = router;
