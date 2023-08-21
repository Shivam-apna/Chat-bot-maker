const express = require("express");
const {
  authentication,
  loginWithEmailAndPassword,
} = require("../controllers/auth.controllers");

const router = express.Router();

router.get("/", authentication);

router.post("/", loginWithEmailAndPassword);

module.exports = router;
