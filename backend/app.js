const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require('cors')

const HttpError = require("./models/http-error");
const usersRoutes = require("./routes/users-routes");
const clipRoutes = require("./routes/clip-routes");
const srRoutes = require("./routes/sr-routes")
const app = express();

app.use(bodyParser.json());
app.use(cors())

app.options('*', cors())
// app.use((req, res, next) => {
//   // Tell the browser which domain to allow client requests from, postman will not care about such headers
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   // Controls which headers incoming requests might have
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
//   next();
// });
// const corsOptions = {
//   origin: false,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// };
// app.use(cors(corsOptions))



//routes
app.use("/user", usersRoutes);
app.use("/clip", clipRoutes);
// app.use("/bg_remove", bgRoutes);
app.use("/super_res", srRoutes)

// Error Catching for bad routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});
// error catching for the main application
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Connection has been established!!");
    app.listen(5001);
  })
  .catch((error) => {
    console.log(error);
  });
