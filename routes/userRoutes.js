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
router.post(
  "/update-password",
  authController.protect,
  authController.updatePassword,
);

//TODO TEMP ROUTE
router.patch("/:id", userController.updateUser);

module.exports = router;
