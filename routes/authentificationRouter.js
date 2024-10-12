const express = require("express");
const authentificationController = require("../controllers/authentificationController.js");
const router = express.Router();

router.get("/sign_up", authentificationController.getSignUpPageGet);
router.post("/sign_up", authentificationController.signUpPost);

module.exports = router;
