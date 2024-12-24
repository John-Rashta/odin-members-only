const { Router } = require("express");
const joinController = require("../controllers/joinController");
const joinRouter = Router();

joinRouter.get("/member", joinController.showMember);
joinRouter.post("/member", joinController.makeMember);
joinRouter.get("/admin", joinController.showAdmin);
joinRouter.post("/admin", joinController.makeAdmin);

module.exports = joinRouter;