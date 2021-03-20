const express = require("express");
const { body } = require("express-validator");
const { index, create } = require("../controllers/category");

const isLoggedIn = require("../middleware/is-logged-in");
const hasPermission = require("../middleware/has-permission");

const validateErrors = require("../middleware/validate-errors");
const router = express.Router();

router.get("/", index);

router.post(
    "/",
    body("name")
        .isString()
        .withMessage("Please enter a valid category name")
        .trim()
        .escape(),
    body("description")
        .optional()
        .isString()
        .withMessage("Please enter a valid category description")
        .trim()
        .escape(),
    validateErrors,
    isLoggedIn,
    hasPermission("forum:createCategory"),
    create
);
module.exports = router;