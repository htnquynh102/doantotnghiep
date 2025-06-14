const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUserById,
} = require("../controllers/UserController");
const { authMiddleware } = require("../middleware/AuthMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/get-all", getAllUsers);
router.get("/get-details/:id", getUserById);
router.patch("/update-user/:id", upload.single("anhDaiDien"), updateUserById);

module.exports = router;
