const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');

// @desc    Get all Courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCoursesByUniversity = asyncHandler(async (req, res) => {
  const { universityId } = req.params;

  const courses = await Course.findAll({
    where: { InstitutionId: universityId },
  });

  if (!courses || courses.length === 0) {
    return next(new ErrorResponse(`No Course found in state with ID ${universityId}`, 404));
  }

  res.status(200).json({ success: true, data: courses });
});
