const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const State = require('../models/State');
const University = require('../models/University');

const universities = require('../_data/universities');
const polytechnics = require('../_data/polytechnics');
const collegeOfEducation = require('../_data/collegeOfEducation');
const healthSciences = require('../_data/healthSciences');

// Reusable function
const getInstitutionsByCategory = async (matcherFn) => {
  const categorizedList = [];

  const allStates = await State.find();
  for (const state of allStates) {
    const institutions = await University.find({ stateId: state.stateId.toString() });

    const matched = institutions.filter((inst) => matcherFn(inst.InstitutionName));
    if (matched.length > 0) {
      categorizedList.push({
        state: state.stateName,
        institutions: matched
      });
    }
  }

  return categorizedList;
};

// @desc    Get all Universities in Nigeria
// @route   GET /api/v1/undergraduate/institutions/universities
// @access  Public
exports.getUniversities = asyncHandler(async (req, res, next) => {
  // Fetch all institutions
  const allInstitutions = await University.find();

  // Filter only those that match the name
  const result = allInstitutions.filter(inst =>
    universities.includes(inst.InstitutionName) || inst.InstitutionName.includes('University')
  );

  if (!result.length) {
    return next(new ErrorResponse('No university found', 404));
  }

  res.status(200).json({ success: true, data: result });
});

// @desc    Get all Polytechnics in Nigeria
// @route   GET /api/v1/undergraduate/institutions/polytechnics
// @access  Public
exports.getPolytechnics = asyncHandler(async (req, res, next) => {
  const result = await getInstitutionsByCategory(name =>
    polytechnics.includes(name) ||
    name.includes('Polytechnic') ||
    name.includes('Polytehnic') ||
    name.includes('Poly')
  );

  if (!result) {
    return next(
      new ErrorResponse('No polytechnics found', 404)
    );
  }

  res.status(200).json({ success: true, data: result });
  
});

// Colleges of Education
exports.getColleges = async (req, res) => {
  try {
    const result = await getInstitutionsByCategory(name =>
      collegeOfEducation.includes(name) || name.includes('Education')
    );

    res.status(200).json({ success: true, category: 'colleges of education', data: result });
  } catch (err) {
    console.error('Error fetching colleges:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Health Sciences
exports.getHealthSciences = async (req, res) => {
  try {
    const result = await getInstitutionsByCategory(name =>
      healthSciences.includes(name) ||
      name.includes('Nursing') ||
      name.includes('Medical') ||
      name.includes('Midwifery') ||
      name.includes('Health')
    );

    res.status(200).json({ success: true, category: 'health sciences', data: result });
  } catch (err) {
    console.error('Error fetching health sciences:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all Universities with Courses
// @route   GET /api/v1/undergraduate/institutions/:stateId
// @access  Public
exports.getUniversitiesByState = asyncHandler(async (req, res, next) => {
  const { stateId } = req.params;

  const universities = await University.find({
     stateId 
    }).select('InstitutionId InstitutionName');

  const transformeduniversities = universities.map(university => ({
    InstitutionId: university.InstitutionId,
    InstitutionName: university.InstitutionName
  }));

  if (!transformeduniversities || transformeduniversities.length === 0) {
    return next(
      new ErrorResponse(`No university found in state with ID ${stateId}`, 404)
    );
  }

  res.status(200).json({ success: true, data: transformeduniversities });
  
});
