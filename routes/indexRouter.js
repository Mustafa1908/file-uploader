const express = require("express");
const indexController = require("../controllers/indexController.js");
const router = express.Router();

router.get("/", indexController.getHomePageGet);

module.exports = router;
