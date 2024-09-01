const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');

// @desc    Get all Courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCoursesByUniversity = asyncHandler(async (req, res) => {
  const { universityId } = req.params;

  const courses = await Course.find({
    where: { InstitutionId: universityId },
  }).select('CourseId CourseName CGPA_Scale Special');

  
  const transformedCourses = courses.map(course => ({
    CourseId: course.CourseId,
    CourseName: course.CourseName,
    CGPA_Scale: course.CGPA_Scale.toString(),
    Special: course.Special
  }));

  if (!transformedCourses || transformedCourses.length === 0) {
    return next(new ErrorResponse(`No Course found in state with ID ${universityId}`, 404));
  }

  res.status(200).json({ success: true, data: transformedCourses });
});
