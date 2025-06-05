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
const getStateIds = async (providedStates, statesToImport) => {
  const stateIds = {};

  for (const { StateName, StateId } of providedStates) {
    if (!statesToImport.includes(StateName)) continue;

    let state = await State.findOne({ stateName: StateName });
    if (!state) {
      state = await State.create({
        stateName: StateName,
        stateId: StateId,
      });
    }

    stateIds[StateName] = StateId;
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
      InstitutionId: universityData.InstitutionId,
      stateId: stateIds[stateName],
    });
    universityIds[universityData.InstitutionId] = university.InstitutionId
  }
  return universityIds;
};

// Function to create courses
const createCourses = async (InstitutionId, stateName) => {
  let coursesData;
  const filePath = `${__dirname}/_data/${stateName}/${InstitutionId}.json`;

  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Course file not found for ${stateName}/${InstitutionId}.json. Skipping...`);
      return;
    }

    coursesData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error(`Error reading/parsing JSON for courses in state ${stateName}:`, err);
    errorStates.push(stateName);
    return;
  }

  if (!Array.isArray(coursesData)) {
    console.error(`Invalid course data format for state ${stateName} and InstitutionId ${InstitutionId}`);
    errorStates.push(stateName);
    return;
  }

  for (const courseData of coursesData) {
    try {
      await Course.create({
        CourseId: courseData.CourseId,           // <- Make sure your Course model supports this field
        CourseName: courseData.CourseName,
        CGPA_Scale: courseData.CGPA_Scale,
        Special: courseData.Special,
        InstitutionId: InstitutionId,
      });
    } catch (err) {
      console.error(`Error saving course in file ${filePath}:`, err);
    }
  }
};

// Import data into the database
const importData = async () => {
  try {
    const providedStates = [
      { StateId: 382, StateName: "Abia" },
      { StateId: 383, StateName: "Abuja" },
      { StateId: 384, StateName: "Adamawa" },
      { StateId: 385, StateName: "Akwa-Ibom" },
      { StateId: 386, StateName: "Anambra" },
      { StateId: 387, StateName: "Bauchi" },
      { StateId: 388, StateName: "Bayelsa" },
      { StateId: 389, StateName: "Benue" },
      { StateId: 390, StateName: "Borno" },
      { StateId: 391, StateName: "Cross-River" },
      { StateId: 392, StateName: "Delta" },
      { StateId: 393, StateName: "Ebonyi" },
      { StateId: 394, StateName: "Edo" },
      { StateId: 395, StateName: "Ekiti" },
      { StateId: 396, StateName: "Enugu" },
      { StateId: 397, StateName: "Gombe" },
      { StateId: 398, StateName: "Imo" },
      { StateId: 399, StateName: "Jigawa" },
      { StateId: 400, StateName: "Kaduna" },
      { StateId: 401, StateName: "Kano" },
      { StateId: 402, StateName: "Kastina" },
      { StateId: 403, StateName: "Kebbi" },
      { StateId: 404, StateName: "Kogi" },
      { StateId: 405, StateName: "Kwara" },
      { StateId: 406, StateName: "Lagos" },
      { StateId: 407, StateName: "Nassarawa" },
      { StateId: 408, StateName: "Niger" },
      { StateId: 409, StateName: "Ogun" },
      { StateId: 410, StateName: "Ondo" },
      { StateId: 411, StateName: "Osun" },
      { StateId: 412, StateName: "Oyo" },
      { StateId: 413, StateName: "Pleatue" },
    ];

    const stateIds = await getStateIds(providedStates, providedStates.map(s => s.StateName));

    // Loop through each state and process universities and courses
    for (const stateName of providedStates.map(s => s.StateName)) {
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
