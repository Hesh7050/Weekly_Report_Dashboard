const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const validationHandler = require("../utils/validationHandler");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerValidator, validationHandler, registerUser);
router.post("/login", loginValidator, validationHandler, loginUser);

// Private routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);

// Test manager-only route
router.get("/manager-test", protect, authorizeRoles("manager"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Manager access working",
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

// Test member-only route
router.get("/member-test", protect, authorizeRoles("member"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Member access working",
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

module.exports = router;