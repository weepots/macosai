const axios = require("axios");
const HttpError = require("../models/http-error");

const startProcess = async (req, res, next) => {
  let data = { Message: "Super Resolution Start start Failed" };
  try {

    // res.redirect(307, "http://127.0.0.1:8001/super_resolution")
    
    // const response = await axios.get("http://127.0.0.1:8001/super_resolution");
    // data = response.data;
  } catch (err) {
    const error = new HttpError("Something when wrong when starting Super Resolution", 500);
    return next(error);
  }
  res.status(201).json({ Endpoint: "Super Resolution Start Endpoint", Message: data });
};

const stopProcess = async (req, res, next) => {
  res.status(201).json({ Endpoint: "Super Resolution Stop Endpoint" });
};

const viewResults = async (req, res, next) => {
  res.status(201).json({ Endpoint: "Super Resolution View Results Endpoint" });
};

exports.startProcess = startProcess;
exports.stopProcess = stopProcess;
exports.viewResults = viewResults;