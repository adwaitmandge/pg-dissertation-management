const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs").promises;
const asyncHandler = require("express-async-handler");
const { text } = require("express");
const axios = require("axios");
const { default: mongoose } = require("mongoose");
const PendingThesis = require("../models/pendingThesisModel");

const firstSubmission = async (req, res) => {
  try {
    console.log("Inside the firstSubmisstion route");
    console.log(req.body);
    res.json("Uploaded");
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = { firstSubmission };
