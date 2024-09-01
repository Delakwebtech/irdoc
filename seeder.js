const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Load models
const State = require("./models/State");
const University = require("./models/University");
const Course = require("./models/Course");

// Set mongoose `strictQuery` option to suppress the deprecation warning
mongoose.set("strictQuery", true);

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Store states that encounter errors
const errorStates = [];

// Function to create states and return their IDs
const getStateIds = async (states) => {
  const stateIds = {};
  for (const stateName of states) {
    // Check if the state already exists
    let state = await State.findOne({ stateName });
    if (!state) {
      state = await State.create({ stateName });
    }
    stateIds[stateName] = state.stateId; // Use stateId from State model
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
        "utf-8"
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
        "utf-8"
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
    console.error(
      `Invalid course data format for state ${stateName} and university ID ${universityId}`
    );
    errorStates.push(stateName);
    return;
  }

  for (const courseData of coursesData) {
    try {
      await Course.create({
        CourseName: courseData.CourseName,
        CGPA_Scale: courseData.CGPA_Scale,
        Special: courseData.Special,
        InstitutionId: universityId,
      });
    } catch (err) {
      console.error(
        `Error in file: ${__dirname}/_data/${stateName}/${universityId}.json`,
        err
      );
    }
  }
};

// Import data into the database
const importData = async () => {
  try {
    const states = [
      "Abia",
      "Abuja",
      "Adamawa",
      "Akwa-Ibom",
      "Anambra",
      "Bauchi",
      "Bayelsa",
      "Benue",
      "Borno",
      "Cross-River",
      "Delta",
      "Ebonyi",
      "Edo",
      "Ekiti",
      "Enugu",
      "Gombe",
      "Imo",
      "Jigawa",
      "Kaduna",
      "Kano",
      "Kastina",
      "Kebbi",
      "Kogi",
      "Kwara",
      "Lagos",
      "Nassarawa",
      "Niger",
      "Ogun",
      "Ondo",
      "Osun",
      "Oyo",
      "Pleatue",
    ];

    const stateIds = await getStateIds(states);

    // Loop through each state and process universities and courses
    for (const stateName of states) {
      const universityIds = await getUniversityIds(stateIds, stateName);

      for (const universityId of Object.values(universityIds)) {
        await createCourses(universityId, stateName);
      }
    }

    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from the database
const deleteData = async () => {
  try {
    await State.deleteMany({});
    await University.deleteMany({});
    await Course.deleteMany({});

    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Execute based on command-line argument
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
