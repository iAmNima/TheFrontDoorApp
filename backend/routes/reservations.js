const router = require("express").Router();
let Reservation = require("../models/reservation.model");

router.route("/").get((req, res) => {
  Reservation.find()
    .then((reservations) => res.json(reservations))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const timeSlot = req.body.timeSlot;
  const day = req.body.day;
  const roomNr = req.body.roomNr;

  const newPerson = new Reservation({
    email,
    name,
    timeSlot,
    day,
    roomNr,
  });

  newPerson
    .save()
    .then(() => res.json("Reservation added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
