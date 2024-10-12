const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let getSignUpPageGet = async (req, res) => {
  res.render("sign_up", { signupInformations: "" });
};

let signUpPost = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`User name must be between 1 and 30 characters`),
  body("password")
    .isLength({ min: 4, max: 300 })
    .withMessage(`Password must be between 4 and 300 characters`),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage(`Password are not the same`),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).render("sign_up", {
        errors: errors.array(),
        signupInformations: req.body,
      });
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      try {
        const user = await prisma.user.create({
          data: {
            username: req.body.username,
            password: hashedPassword, // Ensure to hash passwords in production!
          },
        });
        res.redirect("/");
      } catch (error) {
        console.error(error);
      }
    });
  }),
];
let getLoginPageGet = async (req, res) => {
  res.render("log_in");
};

let loginPagePost = [
  asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (!user) {
        // Handle failed authentication
        let logInErrorMessage = [
          {
            type: "field",
            value: "",
            msg: "Username or Password is incorrect.",
            path: "usernamePassword",
            location: "body",
          },
        ];

        return res.status(400).render("log_in", {
          errors: logInErrorMessage,
        });
      }

      // Successful authentication
      req.logIn(user, async (err) => {
        let hour = 3600000;
        req.session.cookie.originalMaxAge = 14 * 24 * hour;
        res.redirect("/");
      });
    })(req, res, next);
  }),
];

let logOutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  getSignUpPageGet,
  signUpPost,
  getLoginPageGet,
  loginPagePost,
  logOutGet,
};
