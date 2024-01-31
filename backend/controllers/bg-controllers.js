const axios = require("axios");
const HttpError = require("../models/http-error");

const startProcess = async (req, res, next) => {
  let data = { Message: "CLIP start Failed" };
  try {
    const response = await axios.get("http://127.0.0.1:8001/start");
    data = response.data;
  } catch (err) {
    const error = new HttpError("Something when wrong when starting CLIP", 500);
    return next(error);
  }

  res.status(201).json({ Endpoint: "CLIP Start Endpoint", Message: data });
};

const stopProcess = async (req, res, next) => {
  res.status(201).json({ Endpoint: "CLIP Stop Endpoint" });
};

const viewResults = async (req, res, next) => {
  res.status(201).json({ Endpoint: "CLIP View Results Endpoint" });
};

exports.startProcess = startProcess;
exports.stopProcess = stopProcess;
exports.viewResults = viewResults;