const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    timeSlot: { type: String, required: true },
    day: { type: String, required: true },
    roomNr: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("reservation", reservationSchema);

module.exports = Reservation;
