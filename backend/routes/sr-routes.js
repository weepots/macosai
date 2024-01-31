const express = require("express");

const srControllers = require("../controllers/sr-controllers");
const router = express.Router();

router.post("/start", srControllers.startProcess);
router.post("/stop", srControllers.stopProcess);
router.get("/viewResults", srControllers.viewResults);

module.exports = router;