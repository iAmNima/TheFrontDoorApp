//adding express and cors modules:
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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

const reservationsRouter = require("./routes/reservations");

app.use("/reservations", reservationsRouter);

//listening on the port:
app.listen(port, () => {
  console.log(`Server is running on the port: ${port}`);
});
