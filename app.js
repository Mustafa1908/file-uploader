const path = require("node:path");
const express = require("express");
const session = require("express-session");
const { PrismaClient } = require("@prisma/client");
//const PrismaSessionStore =
//  require("./node_modules/@quixo3/prisma-session-store")(session);
const app = express();
const prisma = new PrismaClient();
const indexRouter = require("./routes/indexRouter");
const authentificationRouter = require("./routes/authentificationRouter");
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(assetsPath));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter, authentificationRouter);

/*const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000, // ms; how often to check the session store for expired sessions
  ttl: 14 * 24 * 60 * 60, // seconds; how long until expiration
});

app.use(
  session({
    secret: "your-secret-key", // change this to a secure random string
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // cookie expiration
    },
  })
); 

app.get("/", (req, res) => {
  // Example of setting a session variable
  req.session.views = (req.session.views || 0) + 1;
  res.send(`Views: ${req.session.views}`);
}); */

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
