const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const Connection = require("../models/connectionsModel");

const compare = (a, b) => {
  if (a.deadline < b.deadline) return -1;
  if (a.deadline > b.deadline) return 1;
  return 0;
};

const sendConnectionRequest = asyncHandler(async (req, res) => {
  try {
    console.log("Send Connections");
    console.log(req.body);
    console.log(req.user._id.toString());
    const newConnection = await Connection.create({
      from: req.body.from,
      to: req.body.to,
    });

    const allConnections = await Connection.find();

    const result = allConnections.filter(
      (request) => request.from == req.user._id.toString()
    );
    console.log("result", result);
    res.json(result);
  } catch (err) {
    console.error(err.message);
  }
});

const fetchPendingConnections = asyncHandler(async (req, res) => {
  try {
    console.log("Fetch Pending Connections");
    console.log(req.user._id.toString());
    const allConnections = await Connection.find().populate("from");

    const result = allConnections.filter(
      (request) =>
        request.to == req.user._id.toString() && request.status == "Pending"
    );
    console.log("result", result);
    res.json(result);
  } catch (err) {
    console.error(err.message);
  }
});

const fetchConnections = asyncHandler(async (req, res) => {
  try {
    console.log("Fetch Connections");
    console.log(req.user._id.toString());
    const allConnections = await Connection.find();

    const result = allConnections.filter(
      (request) => request.from == req.user._id.toString()
    );
    console.log("result", result);
    res.json(result);
  } catch (err) {
    console.error(err.message);
  }
});

const acceptConnection = asyncHandler(async (req, res) => {
  try {
    console.log("Accept Connections");
    console.log(req.body);
    const { id } = req.body;
    const foundConnection = await Connection.findOne({ _id: id });

    foundConnection.status = "Accepted";
    await foundConnection.save();
    const allConnections = await Connection.find();
    res.json(allConnections);
  } catch (err) {
    console.error(err.message);
  }
});

const rejectConnection = asyncHandler(async (req, res) => {
  try {
    console.log("Reject Connections");
    console.log(req.body);
    const { id } = req.body;
    const foundConnection = await Connection.findOneAndDelete({ _id: id });
    const allConnections = await Connection.find();
    res.json(allConnections);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = {
  sendConnectionRequest,
  fetchConnections,
  fetchPendingConnections,
  acceptConnection,
  rejectConnection,
};
