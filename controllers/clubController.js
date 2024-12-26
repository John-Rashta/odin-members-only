const db = require("../db/queries");
const asyncHandler = require('express-async-handler');
const { body, validationResult, query, param, matchedData } = require("express-validator");
const bcrypt = require('bcryptjs');
const passport = require("passport");
require("dotenv").config();

const validateSignUp = [
    body("first_name").trim()
        .isAlpha().withMessage("Must only contain letters.")
        .isLength({min: 1, max: 50}).withMessage("Max 50 characters."),
    body("last_name").trim()
        .isAlpha().withMessage("Must only contain letters.")
        .isLength({min: 1, max: 50}).withMessage("Max 50 characters."),
    body("username").trim()
        .isAlphanumeric().withMessage("Must only contain letters and/or numbers.")
        .isLength({min: 1, max: 255}).withMessage("Max 255 characters."),
    body("password").trim()
        .notEmpty().withMessage("Password is required.")
        .isAscii().withMessage("Must be only Ascii characters."),
    body("confirm_password").trim()
        .custom((value, {req}) => {
            return value === req.body.password;
        }).withMessage("Passwords do not match.")
  ];

const validateLogin = [
body("username").trim()
    .isAlphanumeric().withMessage("Must only contain letters and/or numbers.")
    .isLength({min: 1, max: 255}).withMessage("Max 255 characters."),
body("password").trim()
    .notEmpty().withMessage("Password is required.")
    .isAscii().withMessage("Must be only Ascii characters.")
];

exports.showSignup = asyncHandler(async (req, res) => {
    return res.render("signup");
});

exports.makeSignup = [
    validateSignUp,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("signup", {
                errors: errors.array(),
              });
        };
        const formData = matchedData(req);
        const [invalidUser] = await db.searchForUser(formData.username);
        if (invalidUser) {
            return res.status(400).render("signup", {
                errors: [{msg: "Username already exists."}],
            });
        }

        bcrypt.hash(formData.password, 10, async (err, hashedPassword) => {
            // if err, do something
            if (err) {
                console.log(err);
                return res.status(400).send("Internal Error");
            }
            // otherwise, store hashedPassword in DB
            await db.insertUser(formData.first_name, formData.last_name, formData.username, hashedPassword);
        });

        res.redirect("/");
    })
];

exports.showLoginUser = asyncHandler(async (req, res) => {
    if (req.user) {
        return res.redirect("/");
    }
    return res.render("login");
});

exports.makeLoginUser = [
    validateLogin,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("login", {
                errors: errors.array(),
            });
        };
        next();
    }),
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
      }),
];

exports.logoutUser = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
    });
});