const express = require("express");
const { body } = require("express-validator");
const { index, create, update, destroy } = require("../controllers/reply");

const isLoggedIn = require("../middleware/is-logged-in");
const hasPermission = require("../middleware/has-permission");

const validateErrors = require("../middleware/validate-errors");
const router = express.Router();

router.get(
    "/", 
    body("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Please enter a valid page"),
    validateErrors,
    index);

router.post(
    "/",
    body("content")
        .isString()
        .withMessage("Please enter a valid reply")
        .trim()
        .escape(),
    validateErrors,
    isLoggedIn,
    hasPermission("forum:createReply"),
    create
);

router.put(
    "/:replyId",
    body("content")
        .isString()
        .withMessage("Please enter a valid reply")
        .trim()
        .escape(),
    validateErrors,
    isLoggedIn,
    // TODO: HANDLE LOGIC
    hasPermission(["forum:updateReply", "forum:adminUpdateReply"]),
    update
);

router.delete(
    "/:replyId",
    isLoggedIn,
    // TODO: HANDLE LOGIC
    hasPermission(["forum:deleteReply", "forum:adminDeleteReply"]),
    destroy
)
module.exports = router;