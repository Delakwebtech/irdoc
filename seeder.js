const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Load models
const State = require('./models/State');
const University = require('./models/University');
const Course = require('./models/Course');

// Connect to the database
const sequelize = require('./config/db');
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

// Store states that encounter errors
const errorStates = [];

// Function to create states and return their IDs
const getStateIds = async (states) => {
  const stateIds = {};
  for (const stateName of states) {
    const state = await State.create({ stateName });
    stateIds[stateName] = state.stateId;
  }
  return stateIds;
};

// Function to create universities and return their IDs
const getUniversityIds = async (stateIds, stateName) => {
  let universitiesData;
  try {
    universitiesData = JSON.parse(
      fs.readFileSync(
        `${__dirname}/_data/${stateName}/${stateName.toLowerCase()}-universities.json`,
        'utf-8'
      )
    );
  } catch (err) {
    console.error(`Error reading or parsing JSON for state ${stateName}:`, err);
    errorStates.push(stateName);
    return {};
  }

  const universityIds = {};
  for (const universityData of universitiesData) {
    const university = await University.create({
      InstitutionId: universityData.InstitutionId,
      InstitutionName: universityData.InstitutionName,
      stateId: stateIds[stateName],
    });
    universityIds[universityData.InstitutionId] = university.InstitutionId;
  }
  return universityIds;
};

// Function to create courses
const createCourses = async (universityId, stateName) => {
  let coursesData;
  try {
    coursesData = JSON.parse(
      fs.readFileSync(
        `${__dirname}/_data/${stateName}/${universityId}.json`,
        'utf-8'
      )
    );
  } catch (err) {
    console.error(
      `Error reading or parsing JSON for courses in state ${stateName}:`,
      err
    );
    errorStates.push(stateName);
    return;
  }

  if (!Array.isArray(coursesData)) {
    console.error(`Invalid course data format for state ${stateName} and university ID ${universityId}`);
    errorStates.push(stateName);
    return;
  }

  for (const courseData of coursesData) {
    try {
      await Course.create({
        CourseId: courseData.CourseId,
        CourseName: courseData.CourseName,
        CGPA_Scale: courseData.CGPA_Scale,
        Special: courseData.Special,
        InstitutionId: universityId,
      });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        console.error(
          `Duplicate error in file: ${__dirname}/_data/${stateName}/${universityId}.json for CourseId: ${courseData.CourseId}`
        );
      } else {
        console.error(
          `Error in file: ${__dirname}/_data/${stateName}/${universityId}.json`,
          err
        );
      }
    }
  }
};

// Import data into the database
const importData = async () => {
  try {
    const states = [
      'Abia',
      'Abuja',
      'Adamawa',
      'Akwa-Ibom',
      'Anambra',
      'Bauchi',
      'Bayelsa',
      'Benue',
      'Borno',
      'Cross-River',
      'Delta',
      'Ebonyi',
      'Edo',
      'Ekiti',
      'Enugu',
      'Gombe',
      'Imo',
      'Jigawa',
      'Kaduna',
      'Kano',
      'Kastina',
      'Kebbi',
      'Kogi',
      'Kwara',
      'Lagos',
      'Nassarawa',
      'Niger',
      'Ogun',
      'Ondo',
      'Osun',
      'Oyo',
      'Pleatue',
    ];

    const stateIds = await getStateIds(states);

    // Loop through each state and process universities and courses
    for (const stateName of states) {
      const universityIds = await getUniversityIds(stateIds, stateName);

      for (const universityId of Object.values(universityIds)) {
        await createCourses(universityId, stateName);
      }
    }

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from the database
const deleteData = async () => {
  try {
    await State.destroy({ where: {} });
    await University.destroy({ where: {} });
    await Course.destroy({ where: {} });

    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Execute based on command-line argument
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
