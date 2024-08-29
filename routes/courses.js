const express = require('express');
const {
  getCoursesByUniversity,
} = require('../controller/course');

const router = express.Router();

router.get('/institution/:universityId', getCoursesByUniversity);


module.exports = router;
