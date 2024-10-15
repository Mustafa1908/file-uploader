const express = require("express");
const authentificationController = require("../controllers/authentificationController.js");
const router = express.Router();

router.get("/sign_up", authentificationController.getSignUpPageGet);
router.post("/sign_up", authentificationController.signUpPost);
router.get("/log_in", authentificationController.getLoginPageGet);
router.post("/log_in", authentificationController.logInPost);
router.get("/log_out", authentificationController.logOutGet);

module.exports = router;
