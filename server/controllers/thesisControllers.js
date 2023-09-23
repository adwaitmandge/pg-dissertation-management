const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs").promises;
const asyncHandler = require("express-async-handler");
const { text } = require("express");
const axios = require("axios");
const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const PendingThesis = require("../models/pendingThesisModel");

const cloudinary = require("cloudinary").v2;
// Configure Cloudinary with your credentials
cloudinary.config({
  // cloud_name: "dnkhiub4n", // Replace with your Cloudinary cloud name
  // api_key: "468266744748937", // Replace with your Cloudinary API key
  // api_secret: "Ngv99eg4xR2iL3LQEcJHo7tjibE", // Replace with your Clo
  cloud_name: "ddyiex0z8",
  api_key: "616962189132742",
  api_secret: "s_7ldYcshqnuvBz7PnYj8E6S9fI",
  secure: true,
});

async function uploadPdfToCloudinary(localFilePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localFilePath,
      { resource_type: "raw" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
}

const createPDF = asyncHandler(async (req, res) => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a new page to the PDF
    // Get the content string you want to add to the PDF
    const { data } = req.body;
    const paragraphs = data.split("#");

    console.log(paragraphs);

    for (const paragraph of paragraphs) {
      const page = pdfDoc.addPage([600, 400]); // Adjust the page size as needed
      const fontSize = 14;
      const textColor = rgb(0, 0, 0); // Black color
      const maxLineWidth = 530;

      // Draw the content on the page
      page.drawText(paragraph, {
        x: 50,
        y: 300,
        size: fontSize,
        maxWidth: maxLineWidth,
        color: textColor, // Black color
      });
    }

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Write the PDF bytes to a file
    await fs.writeFile("output.pdf", pdfBytes);
    const localPdfPath =
      "C:/Users/Adwait/OneDrive/Desktop/builds/sih/server/output.pdf";

    try {
      const publicUrl = await uploadPdfToCloudinary(localPdfPath);
      console.log("File uploaded successfully.");
      console.log("Public URL:", publicUrl);
      res.json({ data: publicUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  } catch (error) {
    console.log("Error occurred while fetching goals at the backend");
    console.log(error);
  }
});

const summarize = async (req, res) => {
  const config = {
    headers: {
      "x-api-key": "sec_gxkDpDyDqYF6qQZzgWrJZ1OIKUecpt0r",
      "Content-Type": "application/json",
    },
  };

  console.log(req.body.sourceId);

  const data = {
    sourceId: req.body.sourceId,
    messages: [
      {
        role: "user",
        content: "Summarise this document in 600 words",
      },
    ],
  };

  console.log(data);

  try {
    const response = await fetch("https://api.chatpdf.com/v1/chats/message", {
      method: "POST",
      headers: {
        "x-api-key": "sec_gxkDpDyDqYF6qQZzgWrJZ1OIKUecpt0r",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const someData = await response.json();
    console.log(someData);
    res.json({ result: someData });
  } catch (err) {
    console.error(err.message);
  }
};

const fetchAllThesis = async (req, res) => {
  try {
    const professor = await User.findOne({ name: "Prof. Shrawne" });
    console.log(professor);
    res.json(professor);
  } catch (err) {
    console.error(err.message);
  }
};
const fetchMyThesis = async (req, res) => {
  try {
    const thes = await PendingThesis.find({ student: req.user._id });
    console.log(thes);
    res.json(thes);
  } catch (err) {
    console.error(err.message);
  }
};

const firstSubmission = async (req, res) => {
  try {
    console.log("Inside the firstSubmisstion route");
    console.log(req.body);
    const { publications } = req.body;
    console.log(publications);

    const pendingThesis = await PendingThesis.create({
      cloudinaryLink: publications[0].cloudinaryLink,
      student: req.user._id,
      mentor: "65085b05d2c40c0d85800534",
    });

    console.log(pendingThesis);

    res.json(pendingThesis);
  } catch (err) {
    console.error(err.message);
  }
};

const fetchNotifications = async (req, res) => {
  try {
    console.log("Inside the fetch notifications");

    const pendingThesis = await PendingThesis.find({
      mentor: req.user._id,
    }).populate("student");
    console.log(pendingThesis);
    res.json(pendingThesis);
  } catch (err) {
    console.error(err.message);
  }
};

const updateFeedback = async (req, res) => {
  try {
    console.log("Inside update feedback");
    console.log(req.body);

    const { id, newStatus, feedback } = req.body;
    const foundThesis = await PendingThesis.findOneAndUpdate(
      { _id: id },
      { status: newStatus, feedback: feedback },
      { new: true } // This option returns the updated document
    );

    const allThesis = await PendingThesis.find();
    console.log("Printing all thesis");
    console.log(allThesis);

    if (!foundThesis) {
      return res.status(404).json({ message: "Thesis not found" });
    }

    res.json(foundThesis);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createPDF,
  summarize,
  fetchAllThesis,
  firstSubmission,
  fetchNotifications,
  updateFeedback,
  fetchMyThesis,
};
