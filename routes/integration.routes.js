const express = require("express");
const { integration } = require("../controllers/integration.controllers");

const router = express.Router();

router.get("/", integration);

module.exports = router;
