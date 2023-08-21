
const express = require("express");
const {
    dashboard,
    validateFile
} = require("../controllers/dashboard.controllers");

const router = express.Router();

router.get("/", dashboard);

router.post("/validateFile", validateFile);

module.exports = router;