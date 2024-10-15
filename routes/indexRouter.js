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
router.get(
  "/update_folder_name/:id/:folderName",
  indexController.getUpdateFolderNamePage
);
router.post(
  "/update_folder_name/:id/:folderName",
  indexController.updateFolderName
);
router.get(
  "/delete_folder/:id/:folderName",
  indexController.getDeleteFolderPage
);
router.post("/delete_folder/:id/:folderName", indexController.deleteFolder);

module.exports = router;
