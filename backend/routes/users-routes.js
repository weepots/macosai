const express = require("express");

const usersController = require("../controllers/users-controllers");
const router = express.Router();

router.post("/login", usersController.login);
router.post("/signup", usersController.signup);
router.get("/logout", usersController.logout);
router.get("/viewAccount", usersController.viewAccount);

module.exports = router;
