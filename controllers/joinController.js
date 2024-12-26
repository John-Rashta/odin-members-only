const db = require("../db/queries");
const asyncHandler = require('express-async-handler');
const { body, validationResult, query, param, matchedData } = require("express-validator");
const { isAuth } = require("../middleware/authMiddleware");

const validatePasscode = [
    body("password").trim()
        .notEmpty().withMessage("Password is required.")
        .isAscii().withMessage("Must be only Ascii characters."),
    body("confirm_password").trim()
        .custom((value, {req}) => {
            return value === req.body.password;
        }).withMessage("Passwords do not match.")
  ];

exports.showMember = [
    isAuth,
    asyncHandler(async (req, res) => {
        return res.render("membership");
    })
];

exports.makeMember = [
    validatePasscode,
    isAuth,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("membership", {
                errors: errors.array(),
              });
        };

        const passData = matchedData(req);

        if (process.env.SECRET_PASSCODE === passData.password) {
            await db.updateMembership(req.user.id, true);
            return res.redirect("/");
        }

        return res.status(400).render("membership", {
            errors: [{msg: "Wrong Secret Passcode"}],
        });

    })
];

exports.showAdmin = [
    isAuth,
    asyncHandler(async (req, res) => {
        return res.render("admin");
    })
];

exports.makeAdmin = [
    isAuth,
    validatePasscode,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("membership", {
                errors: errors.array(),
              });
        };

        const passData = matchedData(req);

        if (process.env.SUPER_SECRET_PASSCODE === passData.password) {
            await db.updateAdminship(req.user.id, true);
            return res.redirect("/");
        }

        return res.status(400).render("admin", {
            errors: [{msg: "Wrong Secret Passcode"}],
        });

    })
];