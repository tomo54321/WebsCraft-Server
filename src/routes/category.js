const express = require("express");
const { body } = require("express-validator");
const { index, create, update, destroy, get } = require("../controllers/category");

const isLoggedIn = require("../middleware/is-logged-in");
const hasPermission = require("../middleware/has-permission");

const validateErrors = require("../middleware/validate-errors");
const router = express.Router();

router.get("/", index);

router.get("/:categorySlug", get);

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

router.put(
    "/:categoryId",
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
    hasPermission("forum:updateCategory"),
    update
);

router.delete(
    "/:categoryId",
    isLoggedIn,
    hasPermission("forum:deleteCategory"),
    destroy
)
module.exports = router;