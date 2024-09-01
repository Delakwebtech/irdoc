const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const CourseSchema = new mongoose.Schema(
  {
    CourseId: {
      type: Number,
      unique: true,
    },
    CourseName: {
      type: String,
      required: true,
    },
    CGPA_Scale: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    Special: {
      type: Boolean,
      default: false,
    },
    InstitutionId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

// Apply auto-increment plugin to CourseId
CourseSchema.plugin(AutoIncrement, { inc_field: "CourseId" });

module.exports = mongoose.model("Course", CourseSchema);
