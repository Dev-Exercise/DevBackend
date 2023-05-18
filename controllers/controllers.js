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
  const distance = "10";
  const duration = "10";
  try {
    const documents = await JourneyModel.find({
      ["Covered distance (m)"]: { $gt: distance },
      ["Duration (sec.)"]: { $gt: duration },
    }).limit(100);
    console.log(documents);
    const modifiedDocuments = documents.map((document) => ({
      ...document.toObject(),
      ["Covered distance (m)"]: document["Covered distance (m)"] / 1000,
      ["Duration (sec"]: Math.ceil(document["Duration (sec"][")"] / 60),
    }));

    res.send(modifiedDocuments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//find all station list
exports.stationData = async (req, res) => {
  const result = req.query.search;
  var search;
  result ? (search = result) : (search = "");

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

//Average Distance
exports.startingDistance = async (req, res) => {
  try {
    const stationName = req.params.stationName;

    const result = await JourneyModel.aggregate([
      {
        $match: {
          ["Departure station name"]: stationName,
        },
      },
      {
        $group: {
          _id: null,
          averageDistance: { $avg: "$Covered distance (m)" },
        },
      },
    ]);

    if (result.length === 0) {
      res
        .status(404)
        .json({ error: "No journeys found from the specified station" });
    } else {
      res.json({ averageDistance: result[0].averageDistance });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};
exports.endingDistance = async (req, res) => {
  try {
    const stationName = req.params.stationName;

    const result = await JourneyModel.aggregate([
      {
        $match: {
          ["Return station name"]: stationName,
        },
      },
      {
        $group: {
          _id: null,
          averageDistance: { $avg: "$Covered distance (m)" },
        },
      },
    ]);

    if (result.length === 0) {
      res
        .status(404)
        .json({ error: "No journeys found from the specified station" });
    } else {
      res.json({ averageDistance: result[0].averageDistance });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

//Top 5 return station

exports.topFiveReturn = async (req, res) => {
  try {
    const { departureStation } = req.params;

    // Aggregate the collection to count the return stations
    const result = await JourneyModel.aggregate([
      { $match: { ["Departure station name"]: departureStation } },
      { $group: { _id: "$Return station name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.topFiveDeparture = async (req, res) => {
  try {
    const { returnStation } = req.params;

    // Aggregate the collection to count the return stations
    const result = await JourneyModel.aggregate([
      { $match: { ["Return station name"]: returnStation } },
      { $group: { _id: "$Departure station name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
};

//Create New Journeys
exports.newJourney = async (req, res) => {
  try {
    const journey = new JourneyModel({
      Departure: req.body.Departure,
      Return: req.body.Return,
      ["Departure station id"]: req.body["Departure station id"],
      ["Departure station name"]: req.body["Departure station name"],
      ["Return station id"]: req.body["Return station id"],
      ["Return station name"]: req.body["Return station name"],
      ["Covered distance (m)"]: req.body["Covered distance (m)"],
      ["Duration (sec)"]: req.body["Duration (sec)"],
    });

    // Save the journey to the database
    await journey.save();

    res.status(201).json({ message: "Journey saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while saving the journey" });
  }
};
