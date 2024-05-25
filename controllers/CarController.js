var config = require("../database/db");
const path = require("path");
const Joi = require("joi"); // WORDT GEBRUIKT VOOR VALIDATIE VAN DE INPUTS //

// GET ALLE AUTOS //
const getAllCars = (req, res) => {
  const query = "SELECT * FROM car";

  config.query(query, (err, results) => {
    if (err) {
      console.error("Fout bij het uitvoeren van de query: ", err);
      res
        .status(500)
        .send("Er is een fout opgetreden bij het ophalen van de auto's.");
    } else {
      console.log("Gegevens succesvol opgehaald.");
      res.json({ results });
    }
  });
};

// GET EEN BEPAALDE AUTO //
const getCarOnId = (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM car where ID =" + id;

  config.query(query, (err, result) => {
    if (result.length === 0) {
      return res.status(404).json({ error: "Geen auto met dit id" });
    }
    if (err) {
      res.send("Er is een probleem", err).status(500);
    } else {
      res.json(result[0]);
    }
  });
};

// GET IMAGE FOR A CAR //
const getImageCar = (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM car_image WHERE id =" + id;

  config.query(query, (err, results) => {
    if (!results.length) {
      return res.status(404).json({ error: "Geen image auto" });
    }
    if (err) {
      console.error("Fout bij het uitvoeren van de query: ", err);
      res
        .status(500)
        .send("Er is een fout opgetreden bij het ophalen van de auto's.");
    } else {
      console.log("Gegevens succesvol opgehaald.");
      const imagePath = path.join(__dirname, "..", results[0].PATH);
      res.sendFile(imagePath);
    }
  });
};

const createCar = (req, res) => {
  const signupSchema = Joi.object({
    prijs: Joi.number().required().max(1000000).min(0),
    model: Joi.string().required(),
    beschrijving: Joi.string(),
  }).validate(req.body);

  const { error } = signupSchema;
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }else {
    const { prijs, model, beschrijving } = req.body;
    const query = `INSERT INTO car (prijs, model, beschrijving, car_image_id) VALUES (${prijs}, '${model}', '${beschrijving}', '0')`;

    config.query(query, (err, results) => {
      if (err) {
        console.error("Fout bij het uitvoeren van de query: ", err);
        res
          .status(500)
          .send("Er is een fout opgetreden bij het toevoegen van de auto.");
      } else {
        console.log("Gegevens succesvol opgehaald.");
        res.json({ message: "Car created" });
      }
    });
  }
};

module.exports = { getAllCars, getImageCar, getCarOnId, createCar };
