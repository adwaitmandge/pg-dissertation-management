const mongoose = require("mongoose");
const User = require("./models/userModel");

mongoose
  .connect("mongodb://127.0.0.1:27017/dissertationHub")
  .then(() => {
    console.log("Connected to MONGODB successfully");
  })
  .catch((err) => {
    console.log("Couldn't connect to db");
    console.log(err);
  });

const populateStudents = async () => {
  const om = await User.findOne({ name: "Armaan Tiwari" });
  const shinghade = await User.findOne({ name: "Sandeep Shingade" });
  shinghade.students.push(om._id);
  console.log(shinghade);
  await shinghade.save();
};

populateStudents();
