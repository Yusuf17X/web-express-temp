const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

//* To change user password there is 2 steps
// 1. post to this route with only email
router.post("/forgot-password", authController.forgotPassword);
// 2. post to this route with some token and the new password
router.patch("/reset-password/:token", authController.resetPassword);

// Update password without having to forget it :)
router.patch(
  "/update-my-password",
  authController.protect,
  authController.updatePassword,
);

// Update user data
router.patch("/update-me", authController.protect, userController.updateMe);

// Delete user
router.delete("/delete-me", authController.protect, userController.deleteMe);

module.exports = router;
