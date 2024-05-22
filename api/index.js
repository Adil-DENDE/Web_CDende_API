// Imports //
const express = require("express"); // EXPRESS JS //
const port = 3000; // Creatie van de poort en geeft een melding //
const app = express(); // Express aanmaken om die daarna te gebruiken //
const bodyParser = require("body-parser");


// VOOR DE POST ENDPOINTS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// IMPORTEERT DE ROUTES ZODAT IK DIE HIER KAN GEBRUIKEN //
const userRouter = require("../routes/User");
const autoRouter = require("../routes/Auto");




// HIER GEBRUIK IK DIE DAS EEN SOORT GROEP DUS ALLE ENDPOINT IN USER GAAN USER HEBBEN IN DE PATH //
// JE MOET DAT VOOR ELKE ROUTE DOEN //
app.use("/user", userRouter);
app.use("/car", autoRouter);

// HIER GEWOON OM TE TESTEN OF DE SERVER WERKT //
app.get("/", (req, res) => res.send("Express on Vercel"));


app.listen(port, () => {
  console.log("Server is online poort 3000"); // Gewoon om te weten of het wel gelukt is om de server te starten//
});

// Export the app as a module
module.exports = app;