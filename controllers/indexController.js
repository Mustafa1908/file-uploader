const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let getHomePageGet = async (req, res) => {
  res.render("index", { user: req.session.userName });
};

let getFormUploadPageGet = async (req, res) => {
  res.render("form_upload");
};

let formUploadPost = async (req, res) => {
  console.log(req.file);
  res.redirect("/");
};

let getLibraryPage = async (req, res) => {
  const userFolders = await prisma.folder.findMany({
    where: {
      userId: 5,
    },
  });
  res.render("library", { userLibrary: userFolders });
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

module.exports = {
  getHomePageGet,
  getFormUploadPageGet,
  formUploadPost,
  getLibraryPage,
  createFolder,
};
