const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexController.showIndex);
indexRouter.get("create", indexController.showCreateMessage);
indexRouter.post("create", indexController.createMessage);

module.exports = indexRouter;