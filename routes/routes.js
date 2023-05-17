const express = require("express");
const router = express.Router();
const controllers = require("../controllers/controllers");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// -------------    Routing  ----------------------

router.get("/", controllers.home);
router.post("/import-journey", upload.single("csv"), controllers.uploadCsv);
router.post("/import-station", upload.single("csv"), controllers.uploadStation);
router.get("/journey-data", controllers.journeyData);
router.get("/station-data", controllers.stationData);
router.get(
  "/countStartingStation/:stationName",
  controllers.countTotalStartingStation
);
router.get("/countEndingStation/:stationName", controllers.countEndingStation);
router.get(
  "/average-distance-starting/:stationName",
  controllers.startingDistance
);
router.get("/average-distance-ending/:stationName", controllers.endingDistance);
router.get("/topReturnStations/:departureStation", controllers.topFiveReturn);
router.get(
  "/topDepartureStations/:returnStation",
  controllers.topFiveDeparture
);
router.post("/newJourney", controllers.newJourney);

module.exports = router;
