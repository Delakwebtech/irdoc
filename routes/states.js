const express = require('express');
const {
  getStatesWithUniversitiesAndCourses,
} = require('../controller/state');


const router = express.Router();

router.get('/', getStatesWithUniversitiesAndCourses);


module.exports = router;
