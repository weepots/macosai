const express = require("express");

const clipControllers = require("../controllers/clip-controllers");
const router = express.Router();

router.post("/start", clipControllers.startProcess);
router.post("/stop", clipControllers.stopProcess);
router.get("/viewResults", clipControllers.viewResults);

module.exports = router;
