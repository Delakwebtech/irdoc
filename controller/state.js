const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const State = require("../models/State");
const University = require("../models/University");
const Course = require("../models/Course");

// @desc    Get all States with Universities and Courses
// @route   GET /api/v1/states
// @access  Public
exports.getStatesWithUniversitiesAndCourses = asyncHandler(async (req, res) => {
  const states = await State.find().select(
    "stateId stateName"
  );

  const transformedStates = states.map(state => ({
    StateId: state.stateId,
    StateName: state.stateName
  }));

  if (!transformedStates || transformedStates.length === 0) {
    return next(new ErrorResponse("State not found", 404));
  }

  res.status(200).json({ success: true, data: transformedStates });
});
