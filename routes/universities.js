const express = require('express');
const {
  getUniversitiesByState,
} = require('../controller/university');

const router = express.Router();

router.get('/institutions/:stateId', getUniversitiesByState);

module.exports = router;
