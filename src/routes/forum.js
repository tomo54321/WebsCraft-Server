const express = require("express");
const { body } = require("express-validator");
const { index, create, update, destroy, get } = require("../controllers/forum");
const Category = require("../models/Category");

const isLoggedIn = require("../middleware/is-logged-in");
const hasPermission = require("../middleware/has-permission");

const validateErrors = require("../middleware/validate-errors");
const router = express.Router();

router.get("/", index);

router.get("/:forumId", get);

router.post(
    "/",
    body("name")
        .isString()
        .withMessage("Please enter a valid forum name")
        .trim()
        .escape(),
    body("description")
        .optional()
        .isString()
        .withMessage("Please enter a valid forum description")
        .trim()
        .escape(),
    body("parent")
        .optional()
        .isMongoId()
        .withMessage("Please enter a valid parent category")
        .custom((input, { req }) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const category = await Category.findById(input);
                    if (!category) {
                        reject(new Error("The category entered could not be found."));
                    }
                    req.parentForumCategory = category;
                    resolve(true);
                } catch (e) {
                    reject(new Error("Failed to find the category, please try again."));
                }
            })
        }),
    validateErrors,
    isLoggedIn,
    hasPermission("forum:createForum"),
    create
);

router.put(
    "/:forumId",
    body("name")
        .isString()
        .withMessage("Please enter a valid forum name")
        .trim()
        .escape(),
    body("description")
        .optional()
        .isString()
        .withMessage("Please enter a valid forum description")
        .trim()
        .escape(),
    body("parent")
        .optional()
        .isMongoId()
        .withMessage("Please enter a valid parent category")
        .custom((input, { req }) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const category = await Category.findById(input);
                    if (!category) {
                        reject(new Error("The category entered could not be found."));
                    }
                    req.parentForumCategory = category;
                    resolve(true);
                } catch (e) {
                    reject(new Error("Failed to find the category, please try again."));
                }
            })
        }),
    validateErrors,
    isLoggedIn,
    hasPermission("forum:updateForum"),
    update
);

router.delete(
    "/:categoryId",
    isLoggedIn,
    hasPermission("forum:deleteForum"),
    destroy
)
module.exports = router;