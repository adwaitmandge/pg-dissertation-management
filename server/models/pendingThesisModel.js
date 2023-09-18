const mongoose = require("mongoose");
// const Goal = require("./goalModel");
const pendingThesisSchema = new mongoose.Schema(
  {
    cloudinaryLink: {
      type: String,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const PendingThesis = new mongoose.model("PendingThesis", pendingThesisSchema);

module.exports = PendingThesis;
