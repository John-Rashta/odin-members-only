const db = require("../db/queries");
const asyncHandler = require('express-async-handler');
const { body, validationResult, query, param, matchedData } = require("express-validator");
const { isAuth } = require("../middleware/authMiddleware");

const validateMessage = [
    body("title").trim()
        .isAlphanumeric().withMessage("Must only contain letters and/or numbers.")
        .isLength({min: 1, max: 255}).withMessage("Max 255 characters."),
    body("message").trim()
        .notEmpty().withMessage("Message is required.")
        .isAscii().withMessage("Must be only Ascii characters.")
];

const validateId = [
    param("messageid").trim()
        .toInt().isInt().withMessage("Message Does Not Exist.")
];

exports.showIndex = asyncHandler(async (req, res) => {
    const messagesData = await db.getAllMessages();
    return res.render("index", {user: req.user, messages: messagesData});
});

exports.showCreateMessage = [
    isAuth,
    asyncHandler(async (req, res) => {
        return res.render("createMessage");
    })
];

exports.createMessage = [
    validateMessage,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("createMessage", {
                errors: errors.array(),
              });
        };
        const formData = matchedData(req);
        const [newMessageId] = await db.insertMessage(formData.title, new Date(), formData.message);
        await db.connectMessageToAuthor(req.user.id, newMessageId.id);
        res.redirect("/");
    })
];

exports.deleteMessage = [
    isAuth,
    validateId,
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("index", {
                errors: errors.array(),
              });
        };
        const formData = matchedData(req);
        await db.deleteMessage(formData.messageid);
        return res.redirect("/");
    })
]