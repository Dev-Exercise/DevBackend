const express = require("express");
const router = express.Router();
const controllers = require("../controllers/controllers");

// -------------    Routing  ----------------------

router.get("/", controllers.home);

module.exports = router;
