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
  const { search, distance, duration } = req.query;
  // console.log(duration);
  try {
    const result = await JourneyModel.find({
      ["Departure station name"]: { $regex: search, $options: "i" },
      ["Covered distance (m)"]: { $gt: distance },
      ["Duration (sec.)"]: { $gt: duration },
    }).limit(100);

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//find all station list
exports.stationData = async (req, res) => {
  const search = req.query.search;
  try {
    const result = await StationModel.find({
      Name: { $regex: search, $options: "i" },
    }).limit(100);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//find total statring station
exports.countTotalStartingStation = async (req, res) => {
  try {
    const stationName = req.params.stationName;

    const query = {};
    query["Departure station name"] = stationName;

    const count = await JourneyModel.countDocuments(query);

    res.json({ count });
  } catch (error) {
    console.error("Error counting stations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//find total ending station
exports.countEndingStation = async (req, res) => {
  try {
    const stationName = req.params.stationName;

    const query = {};
    query["Return station name"] = stationName;

    const count = await JourneyModel.countDocuments(query);

    res.json({ count });
  } catch (error) {
    console.error("Error counting stations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
