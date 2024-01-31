const HttpError = require("../models/http-error");

const signup = async (req, res, next) => {
  res.status(201).json({ Endpoint: "Sign up Endpoint" });
};

const login = async (req, res, next) => {
  res.status(201).json({ Endpoint: "Login Endpoint" });
};

const logout = async (req, res, next) => [res.status(201).json({ Endpoint: "Logout Endpoint" })];

const viewAccount = async (req, res, next) => {
  res.status(201).json({ Endpoint: "View Account" });
};

exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.viewAccount = viewAccount;
