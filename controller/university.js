const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const University = require('../models/University');

// @desc    Get all Universities with Courses
// @route   GET /api/v1/universities
// @access  Public
exports.getUniversitiesByState = asyncHandler(async (req, res) => {
  const { stateId } = req.params;

  const universities = await University.findAll({
    where: {
      stateId
    }
  });

  if (!universities || universities.length === 0) {
    return next(
      new ErrorResponse(`No university found in state with ID ${stateId}`, 404)
    );
  }

  res.status(200).json({ success: true, data: universities });
  
});
