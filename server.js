const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
var cors = require("cors");
const multer = require("multer");
const csv = require("csvtojson");
const JourneyModel = require("./models/journeyModel");

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

app.listen(3001, () => {
  console.log("listening on port 3001");
});
