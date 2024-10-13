let getHomePageGet = async (req, res) => {
  res.render("index", { user: req.session.userName });
};

module.exports = {
  getHomePageGet,
};
