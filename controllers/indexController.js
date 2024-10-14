const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let getHomePageGet = async (req, res) => {
  res.render("index", { user: req.session.userName });
};

let getFormUploadPageGet = async (req, res) => {
  res.render("form_upload");
};

let formUploadPost = async (req, res) => {
  res.redirect("/");
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

let createFolder = async (req, res) => {
  try {
    const folder = await prisma.folder.create({
      data: {
        folderName: req.body.folderName,
        userId: req.session.userId,
      },
    });
    const userFolders = await prisma.folder.findMany({
      where: {
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

module.exports = {
  getHomePageGet,
  getFormUploadPageGet,
  formUploadPost,
  getLibraryPage,
  createFolder,
  getUpdateFolderNamePage,
  updateFolderName,
};
