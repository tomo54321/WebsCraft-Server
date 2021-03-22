const express = require("express");
const { body } = require("express-validator");
const { index, create, update, destroy, get, lock } = require("../controllers/thread");

const isLoggedIn = require("../middleware/is-logged-in");
const hasPermission = require("../middleware/has-permission");

const validateErrors = require("../middleware/validate-errors");
const router = express.Router();

router.get("/", index);

router.get("/:threadId", get);

router.post(
    "/",
    body("title")
        .isString()
        .withMessage("Please enter a valid thread title")
        .trim()
        .escape(),
    body("content")
        .isString()
        .withMessage("Please enter a valid thread message")
        .trim()
        .escape(),
    validateErrors,
    isLoggedIn,
    hasPermission("forum:createThread"),
    create
);

router.put(
    "/:threadId",
    body("title")
        .isString()
        .withMessage("Please enter a valid thread title")
        .trim()
        .escape(),
    body("locked")
        .optional()
        .isBoolean()
        .withMessage("Please enter a valid lock status"),
    validateErrors,
    isLoggedIn,
    hasPermission(["forum:updateThread", "forum:adminUpdateThread"]),
    update
);

router.put(
    "/:threadId/lock",
    body("locked")
        .optional()
        .isBoolean()
        .withMessage("Please enter a valid lock status"),
    validateErrors,
    isLoggedIn,
    hasPermission(["forum:lockThread", "forum:adminLockThread"]),
    lock
);

router.delete(
    "/:threadId",
    isLoggedIn,
    hasPermission(["forum:deleteThread", "forum:adminDeleteThread"]),
    destroy
)
module.exports = router;