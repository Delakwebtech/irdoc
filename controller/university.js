const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const State = require('../models/State');
const Institution = require('../models/University');

const universities = require('../_data/universities');
const polytechnics = require('../_data/polytechnics');
const collegeOfEducation = require('../_data/collegeOfEducation');
const healthSciences = require('../_data/healthSciences');

// @desc    Get all Universities in Nigeria
// @route   GET /api/v1/undergraduate/institutions/universities
// @access  Public
exports.getUniversities = asyncHandler(async (req, res, next) => {
  // Fetch all institutions
  const allUniversities = await Institution.find();

  // Filter only those that match the name
  const result = allUniversities.filter(inst =>
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
  // Fetch all polytechnics
  const allPolytechnics = await Institution.find();
  
  // Filter only those that match the name
  const result = allPolytechnics.filter(inst =>
    polytechnics.includes(inst.InstitutionName) ||
    inst.InstitutionName.includes('Polytechnic') ||
    inst.InstitutionName.includes('Polytehnic') ||
    inst.InstitutionName.includes('Poly')
  );

  if (!result.length) {
    return next(
      new ErrorResponse('No polytechnics found', 404)
    );
  }

  res.status(200).json({ success: true, data: result });
  
});

// @desc    Get all Colleges of Education in Nigeria
// @route   GET /api/v1/undergraduate/institutions/colleges
// @access  Public
exports.getColleges = asyncHandler(async (req, res, next) => {
  // Fetch all polytechnics
  const allColleges = await Institution.find();

  // Filter only those that match the name
  const result = allColleges.filter(inst =>
    collegeOfEducation.includes(inst.InstitutionName) || inst.InstitutionName.includes('Education')
  );

  if (!result.length) {
    return next(new ErrorResponse('No colleges of education found', 404));
  }

  res.status(200).json({ success: true, data: result });
  
});

// @desc    Get all Health Sciences in Nigeria
// @route   GET /api/v1/undergraduate/institutions/health
// @access  Public
exports.getHealthSciences = asyncHandler(async (req, res, next) => {
  // Fetch all polytechnics
  const allColleges = await Institution.find();

  // Filter only those that match the name
  const result = allColleges.filter(inst =>
    healthSciences.includes(inst.InstitutionName) ||
    inst.InstitutionName.includes('Nursing') ||
    inst.InstitutionName.includes('Medical') ||
    inst.InstitutionName.includes('Midwifery') ||
    inst.InstitutionName.includes('Health')
  );

  if (!result.length) {
    return next(new ErrorResponse('No colleges of education found', 404));
  }

  res.status(200).json({ success: true, data: result });
});

// @desc    Get all other institutions not in universities, polytechnics, colleges or health sciences
// @route   GET /api/v1/undergraduate/institutions/others
// @access  Public
exports.getOtherInstitutions = asyncHandler(async (req, res, next) => {
  // Fetch all institutions
  const allInstitutions = await Institution.find();

  // Filter out known categories
  const result = allInstitutions.filter(inst => {
    const name = inst.InstitutionName;

    const isUniversity = universities.includes(name) || name.includes('University');
    const isPolytechnic = polytechnics.includes(name) 
      || name.includes('Polytechnic') 
      || name.includes('Polytehnic') 
      || name.includes('Poly');
    const isCollege = collegeOfEducation.includes(name) || name.includes('Education');
    const isHealth = healthSciences.includes(name) 
      || name.includes('Nursing') 
      || name.includes('Medical') 
      || name.includes('Midwifery') 
      || name.includes('Health');

    return !(isUniversity || isPolytechnic || isCollege || isHealth);
  });

  if (!result.length) {
    return next(new ErrorResponse('No other institutions found', 404));
  }

  res.status(200).json({ success: true, data: result });
});


// @desc    Get all Universities with Courses
// @route   GET /api/v1/undergraduate/institutions/:stateId
// @access  Public
exports.getUniversitiesByState = asyncHandler(async (req, res, next) => {
  const { stateId } = req.params;

  const universities = await Institution.find({
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
