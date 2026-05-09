const express = require("express");
const router = express.Router();
const pointsController = require("../controllers/pointsController");
const auth = require("../middlewares/auth");

router.get("/balance", auth, pointsController.getBalance);
router.get("/logs", auth, pointsController.getLogs);
router.post("/recharge", auth, pointsController.recharge);

module.exports = router;