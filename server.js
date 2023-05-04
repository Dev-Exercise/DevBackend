const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
var cors = require("cors");
const multer = require("multer");
var fs = require("fs");
const JourneyModel = require("./models/journeyModel");
const csv = require("csvtojson");

app.use(cors());
app.use(bodyParser.json());

const mongoURI =
  "mongodb+srv://mohammadseikh:datastructure@cluster0.sntrb21.mongodb.net/JourneyData?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("Database Connected Successfully"))
  .catch((err) => console.log(err.message));

app.use(routes);

// Set up multer middleware to handle file uploads
const upload = multer({ dest: "uploads/" });

// const journey = [
//   {
//     Departure: "2021-06-30T23:59:46",
//     Return: "2021-06-30T23:59:55",
//     "Departure station id": "041",
//   },
//   {
//     Departure: "2026-06-30T23:59:46",
//     Return: "2026-06-30T23:59:55",
//     "Departure station id": "051",
//   },
// ];

// Set up a route to handle file uploads
app.post("/upload", upload.single("csv"), async (req, res) => {
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
});

app.listen(3001, () => {
  console.log("listening on port 3001");
});
