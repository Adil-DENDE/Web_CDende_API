const express = require("express");
const router = express.Router();
const CarController = require("../controllers/CarController");

// GET ALLE AUTOS //
router.get("/", CarController.getAllCars);

// GET IMAGE FOR A CAR //
router.get("/image/:id", CarController.getImageCar);

// GET EEN BEPAALDE AUTO //
router.get("/:id", CarController.getCarOnId);

// DIT MOET ALTIJD BENEDEN HET IS OM DIE TE EXPORTEREN EN KUNNEN IMPORTEREN IN ANDERE FILES NAMELIJK DE INDEX.JS //
module.exports = router;
