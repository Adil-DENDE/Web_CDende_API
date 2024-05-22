var config = require("../database/db"); // DB CONNECTION //
const jwt = require("jsonwebtoken"); // JWT TOKEN OM DE USER TE AUTHENTICEREN //
const Joi = require("joi"); // WORDT GEBRUIKT VOOR VALIDATIE VAN DE INPUTS //
const path = require("path"); // PATH OM DE IMAGE OP TE HALEN //
const md5 = require("md5"); // MD5 OM HET PASWOORD TE HASHEN //

// HIER WORDEN DE FUNCTIES GESCHREVEN DIE DE REQUESTS VAN DE ROUTES ZULLEN AFHANDELEN //
// DEZE FUNCTIES ZULLEN DE QUERY'S UITVOEREN EN DE RESPONSES TERUGSTUREN //

// REGISTER VAN EEN NIEUWE USER //
const registerUser = (req, res) => {
  // HIER WORDT ER GEBRUIK GEMAAKT VAN JOI OM DE INPUTS TE VALIDEREN //
  // https://medium.com/sliit-foss/the-joy-of-validating-with-joi-b8c87991975b
  const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    paswoord: Joi.string().min(3).required(),
    username: Joi.string().required(),
    repeatPassword: Joi.string()
      .required()
      .valid(Joi.ref("paswoord"))
      .messages({
        "any.only": "The two passwords do not match",
        "any.required": "Please re-enter the password",
      }),
  }).validate(req.body);

  const { error, result } = signupSchema;

  if (error) return res.json({ message: error.message }).status(404);
  else {
    // CHECKEN OF DE EMAIL AL BESTAAT OM GEEN USER MET DEZELFDE EMAIL TOE TE VOEGEN //
    const queryCheck = `SELECT email FROM user WHERE EXISTS (SELECT email FROM user WHERE email = '${signupSchema.value.email}') OR EXISTS (SELECT username FROM user WHERE username = '${signupSchema.value.username}')`;

    // QUERY OM DE USER TOE TE VOEGEN //
    config.query(queryCheck, (err, results) => {
      if (err) {
        res.json({ error: "Iets is foutgelopen !" }).status(404);
      } else {
        if (results.length == 0) {
          // HIER MAKEN WE GEBRUIK VAN MD5 OM HET PASWOORD TE HASHEN //
          const query = `INSERT INTO user VALUES (null, '${
            signupSchema.value.username
          }', '${signupSchema.value.email}', '${md5(
            signupSchema.value.paswoord
          )}', '0')`;
          config.query(query, req.body, (err) => {
            if (err) {
              console.error("Fout bij het uitvoeren van de query: ", err);
              return res.status(500).send("Error");
            } else {
              return res
                .json({ message: "Account succesvol gecreëerd" })
                .status(202);
            }
          });
        } else {
          return res
            .json({ message: "Een account met deze email bestaat !" })
            .status(404);
        }
      }
    });
  }
};

// LOGIN VAN EEN USER //
const authUser = (req, res) => {
  const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    paswoord: Joi.string().min(8).required(),
  });
  const { error, result } = signupSchema.validate(req.body);

  const query = `SELECT * FROM user WHERE email = '${req.body.email}' AND paswoord = '${md5(req.body.paswoord)}'`;
    
  config.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Er is een probleem opgetreden.");
    } else {
      if (results.length === 0) {
        return res.status(404).json({ error: "Onjuiste inloggegevens." });
      } else {
        // HIER GET IK DE ID VAN DE USER ZODAT IK DIE IN DE CLAIMS KAN STEKEN //
        const query = `SELECT id FROM user WHERE email = '${req.body.email}' AND paswoord = '${md5(req.body.paswoord)}'`;
        config.query(query, (err, results) => {
          if (err) {
            return res.status(500).send("Er is een probleem opgetreden.");
          }else{
            // HIER WORD DE JWT TOKEN AANGEMAAKT MET ALS CLAIMS DE EMAIL EN ID VAN DE USER //
            const token = jwt.sign({ email: req.body.email, id: results[0].id },"secret_key",{expiresIn: "3600s",});
            return res.json({ message: "Succesvol ingelogd", token: token });
          }
        });
      }
    }
  });
};

// GEEFT ALLE USERS TERUG //
const getAllUsers = (req, res) => {
  const query = "SELECT * FROM user";

  config.query(query, (err, results) => {
    if (err) {
      console.error("Fout bij het uitvoeren van de query: ", err);
      res
        .status(500)
        .json(
          "Er is een fout opgetreden bij het ophalen van de gebruikers.",
          401
        );
    } else {
      console.log("Gegevens succesvol opgehaald.");
      res.json(results);
    }
  });
};

// GEEFT EEN BEPAALDE USER TERUG //
const getUserOnId = (req, res) => {
  const id = req.params.id;
  // QUERY OM EEN USER OP TE HALEN IK KAN MISSCHIEN LATER DEZE QUERY VERANDEREN BV(OM EEN JOIN TE DOEN MET EEN ANDERE TABLE) //
  const query = "SELECT ID, USERNAME, EMAIL, USER_IMAGE_ID FROM user where ID =" + id;

  config.query(query, (err, result) => {
    if (result.length === 0) {
      return res.status(404).json({ error: "Geen user met dit id" });
    }
    if (err) {
      res.send("Er is een probleem", err).status(500);
    } else {
      res.json(result[0]);
    }
  });
};

// GET IMAGE FOR A CAR //
const getImageUser = (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM user_image WHERE id =" + id;

  config.query(query, (err, results) => {
    if (!results.length) {
      return res.status(404).json({ error: "Geen image user" });
    }
    if (err) {
      console.error("Fout bij het uitvoeren van de query: ", err);
      res
        .status(500)
        .send(
          "Er is een fout opgetreden bij het ophalen van de gebruiker foto."
        );
    } else {
      console.log("Gegevens succesvol opgehaald.");
      const imagePath = path.join(__dirname, "..", results[0].PATH);
      res.sendFile(imagePath);
    }
  });
};

module.exports = {
  getAllUsers,
  getUserOnId,
  registerUser,
  authUser,
  getImageUser,
};
