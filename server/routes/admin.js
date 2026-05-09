const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/admin");
const adminController = require("../controllers/adminController");
const modelController = require("../controllers/modelController");

router.get("/users", adminAuth, adminController.getUsers);
router.put("/users/:id", adminAuth, adminController.updateUser);
router.delete("/users/:id", adminAuth, adminController.deleteUser);
router.put("/users/:id/ban", adminAuth, adminController.toggleBan);

router.get("/stats", adminAuth, adminController.getStats);
router.get("/records", adminAuth, adminController.getRecords);
router.delete("/records/:id", adminAuth, adminController.deleteRecord);

router.get("/models", adminAuth, modelController.getModels);
router.post("/models", adminAuth, modelController.createModel);
router.put("/models/:id", adminAuth, modelController.updateModel);
router.delete("/models/:id", adminAuth, modelController.deleteModel);

module.exports = router;