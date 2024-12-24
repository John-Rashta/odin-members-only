const { Router } = require("express");
const clubController = require("../controllers/clubController");
const clubRouter = Router();

clubRouter.get("/signup", clubController.showSignup);
clubRouter.post("/signup", clubController.makeSignup);
clubRouter.post("/login", clubController.loginUser);
clubRouter.post("/logout", clubController.logoutUser);

module.exports = clubRouter;