const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const StateSchema = new mongoose.Schema(
  {
    stateId: {
      type: Number,
      unique: true,
    },
    stateName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

// Apply auto-increment plugin to stateId
StateSchema.plugin(AutoIncrement, { inc_field: "stateId" });

module.exports = mongoose.model("State", StateSchema);
