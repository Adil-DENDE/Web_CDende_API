const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// REGISTER VAN EEN NIEUWE USER //
router.post("/register", UserController.registerUser);

// LOGIN VAN EEN USER //
router.post("/auth", UserController.authUser);

// GET ALLE USERS //
router.get("/", UserController.getAllUsers);

// GET EEN BEPAALDE USER //
router.get("/:id", UserController.getUserOnId);

// GET IMAGE VOOR EEN USER //
router.get("/image/:id", UserController.getImageUser);

// DIT MOET ALTIJD BENEDEN HET IS OM DIE TE EXPORTEREN EN KUNNEN IMPORTEREN IN ANDERE FILES NAMELIJK DE INDEX.JS //
module.exports = router;
