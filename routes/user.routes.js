const express = require("express");
const {
    getUserInfo
} = require("../controllers/user.controllers");

const router = express.Router();

router.get("/:userId", getUserInfo);

module.exports = router;
