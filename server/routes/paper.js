const express = require("express");
const router = express.Router();
const paperController = require("../controllers/paperController");
const auth = require("../middlewares/auth");

router.post("/rewrite", auth, paperController.rewrite);
router.get("/history", auth, paperController.getHistory);
router.get("/history/:id", auth, paperController.getHistoryDetail);
router.delete("/history/:id", auth, paperController.deleteHistory);

module.exports = router;