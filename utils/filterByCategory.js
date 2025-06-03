const State = require('../models/State');
const Institution = require('../models/University');


// Utility function: Categorize institutions by state
const categorizeByState = async (categoryName, matchFn) => {
  const allStates = await State.find();
  const allInstitutions = await Institution.find();

  const categorized = [];

  for (const state of allStates) {
    const institutionsInState = allInstitutions.filter(inst => inst.stateId === state.stateId);

    const matchedInstitutions = institutionsInState.filter(inst => matchFn(inst.InstitutionName));

    if (matchedInstitutions.length > 0) {
      categorized.push({
        stateId: state.stateId,
        stateName: state.stateName,
        categoryName,
        institutions: matchedInstitutions.map(inst => ({
          InstitutionId: inst.InstitutionId,
          InstitutionName: inst.InstitutionName
        }))
      });
    }
  }

  return categorized;
};

module.exports = categorizeByState;
