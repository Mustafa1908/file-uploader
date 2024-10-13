const express = require("express");
const indexController = require("../controllers/indexController.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/", indexController.getHomePageGet);
router.get("/form_upload", indexController.getFormUploadPageGet);
router.post(
  "/form_upload",
  upload.single("file"),
  indexController.formUploadPost
);
router.get("/library", indexController.getLibraryPage);
router.post("/library", indexController.createFolder);

module.exports = router;
