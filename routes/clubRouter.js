const { Router } = require("express");
const clubController = require("../controllers/clubController");
const clubRouter = Router();

clubRouter.get("/signup", clubController.showSignup);
clubRouter.post("/signup", clubController.makeSignup);
clubRouter.get("/login", clubController.showLoginUser);
clubRouter.post("/login", clubController.makeLoginUser);
clubRouter.get("/logout", clubController.logoutUser);

module.exports = clubRouter;