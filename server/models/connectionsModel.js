const mongoose = require("mongoose");
// const Goal = require("./goalModel");
const connectionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    message: {
      type: String,
      default: "I would like to connect with you!",
    },
  },
  {
    timestamps: true,
  }
);

const Connection = new mongoose.model("Connection", connectionSchema);

module.exports = Connection;
