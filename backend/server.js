//adding express and cors modules:
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

require("dotenv").config();

//creating express server:
const app = express();
const port = process.env.PORT || 5001;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully!");
});

//setting up our middlewares:
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const reservationsRouter = require("./routes/reservations");
const refreshReservationsRouter = require("./routes/refresh-reservation");
const emailServiceRoute = require("./routes/emailsNode");

app.use("/reservations", reservationsRouter);
app.use("/reservations", refreshReservationsRouter);
app.use('/emails', emailServiceRoute);

//listening on the port:
app.listen(port, () => {
  console.log(`Server is running on the port: ${port}`);
});
