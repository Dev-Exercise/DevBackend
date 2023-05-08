const JourneyModel = require("../models/journeyModel");
const StationModel = require("../models/stationModel");
const csv = require("csvtojson");

//Home
exports.home = (req, res) => {
  res.send("hello world");
};

//Upload CSV File
exports.uploadCsv = async (req, res) => {
  // console.log("From there", req.file);
  if (!req.file) {
    return res.status(400).json({ error: "No CSV file uploaded" });
  }

  try {
    const jsonArray = await csv().fromFile(req.file.path);
    console.log(jsonArray[0]);
    await JourneyModel.insertMany(jsonArray);
    console.log("Successfully Imported!");

    // Send the JSON response
    return res.json(jsonArray);

    // Clean up the temporary CSV file
    fs.unlinkSync(req.file.path);
  } catch (err) {
    // Handle any errors that occur during CSV to JSON conversion or MongoDB insertion
    console.error(err);
    return res.status(500).json({ error: "Failed to process CSV file" });
  }
};

//Upload Station CSV
exports.uploadStation = async (req, res) => {
  // console.log("hit", req.file);
  if (!req.file) {
    return res.status(400).json({ error: "No CSV file uploaded" });
  }

  try {
    const jsonArray = await csv().fromFile(req.file.path);
    console.log(jsonArray[0]);
    await StationModel.insertMany(jsonArray);
    console.log("Successfully Imported!");

    // Send the JSON response
    return res.json(jsonArray);

    // Clean up the temporary CSV file
    fs.unlinkSync(req.file.path);
  } catch (err) {
    // Handle any errors that occur during CSV to JSON conversion or MongoDB insertion
    console.error(err);
    return res.status(500).json({ error: "Failed to process CSV file" });
  }
};

//find all jounrey list
exports.journeyData = async (req, res) => {
  try {
    // Query the collection to retrieve all documents
    const result = await JourneyModel.find({}).limit(100);
    const data = res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    // console.log(error);
  }
};
