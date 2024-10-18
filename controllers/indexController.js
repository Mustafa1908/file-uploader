const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dj0kpovxa", // Replace with your cloud name
  api_key: "366613127446414", // Replace with your API key
  api_secret: "RnaEkjR__f-8BWQl3RgyDGho4k0", // Replace with your API secret
});

let getHomePageGet = async (req, res) => {
  res.render("index", { user: req.session.userName });
};

let getFormUploadPageGet = async (req, res) => {
  res.render("form_upload");
};

let formUploadPost = async (req, res) => {
  bcrypt.hash(req.file.originalname, 10, async (err, hashedFileName) => {
    try {
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      });
      console.log(result.secure_url);
      // Add file to database
      const folder = await prisma.file.create({
        data: {
          fileName: req.file.originalname,
          hashedFile: hashedFileName,
          fileSize: req.file.size,
          folderId: req.session.folderId,
          fileUrl: result.secure_url,
        },
      });

      res.redirect("/folder_page");
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  });
};

let getLibraryPage = async (req, res) => {
  const userFolders = await prisma.folder.findMany({
    where: {
      userId: req.session.userId,
    },
    orderBy: {
      id: "asc",
    },
  });
  res.render("library", {
    userLibrary: userFolders,
    userId: req.session.userId,
  });
};

let getFolderPage = async (req, res) => {
  const folder = await prisma.folder.findUnique({
    where: {
      folderName: req.params.folderName,
    },
  });

  const folderFiles = await prisma.file.findMany({
    where: {
      folderId: req.session.folderId,
    },
  });

  req.session.folderId = folder.id;
  res.render("folder_page", {
    urlParams: req.params,
    folderFiles: folderFiles,
  });
};

let getFilePage = async (req, res) => {
  const fileInformations = await prisma.file.findUnique({
    where: {
      fileName: req.params.fileName,
    },
  });
  res.render("file_page", {
    fileData: fileInformations,
    urlParams: req.params,
  });
};

let downloadFile = async (req, res) => {
  const fileInformations = await prisma.file.findUnique({
    where: {
      fileName: req.params.fileName,
    },
  });

  try {
    // Fetch the file from the external URL
    const fileResponse = await axios.get(fileInformations.fileUrl, {
      responseType: "stream",
    });

    // Set the headers to force download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileInformations.fileUrl}"`
    );
    res.setHeader("Content-Type", fileResponse.headers["content-type"]);

    // Pipe the file data to the client
    fileResponse.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error downloading file");
  }
};

let createFolder = async (req, res) => {
  try {
    const folder = await prisma.folder.create({
      data: {
        folderName: req.body.folderName,
        userId: req.session.userId,
      },
    });

    res.redirect("/library");
  } catch (error) {
    console.error(error);
  }
};

let getUpdateFolderNamePage = async (req, res) => {
  res.render("update_folder_name", { urlParams: req.params });
};

let updateFolderName = async (req, res) => {
  const folderId = await prisma.folder.findFirst({
    where: {
      userId: req.params.userId,
      folderName: req.params.folderName,
    },
  });

  const updateFolderName = await prisma.folder.update({
    where: {
      id: folderId.id,
      folderName: req.params.folderName,
    },
    data: {
      folderName: req.body.updatedFolder,
    },
  });

  res.redirect("/library");
};

let getDeleteFolderPage = async (req, res) => {
  res.render("delete_folder", { urlParams: req.params });
};

let deleteFolder = async (req, res) => {
  console.log(req.params.folderName);
  const deleteFolder = await prisma.folder.delete({
    where: {
      folderName: req.params.folderName,
    },
  });

  res.redirect("/library");
};

module.exports = {
  getHomePageGet,
  getFormUploadPageGet,
  formUploadPost,
  getLibraryPage,
  getFolderPage,
  getFilePage,
  downloadFile,
  createFolder,
  getUpdateFolderNamePage,
  updateFolderName,
  getDeleteFolderPage,
  deleteFolder,
};
