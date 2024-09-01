const express = require('express');
const {
  getCoursesByUniversity,
} = require('../controller/course');

const router = express.Router();

router.get('/courseslist/:universityId', getCoursesByUniversity);


module.exports = router;
