const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UniversitySchema = new mongoose.Schema(
  {
    InstitutionId: {
      type: Number,
      unique: true,
    },
    InstitutionName: {
      type: String,
      required: true,
    },
    stateId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

// Apply auto-increment plugin to InstitutionId
UniversitySchema.plugin(AutoIncrement, { inc_field: "InstitutionId" });

module.exports = mongoose.model("University", UniversitySchema);
