const express = require("express");
const { body } = require("express-validator");
const { signup, signin } = require("../controllers/auth");
const validateErrors = require("../middleware/validate-errors");
const router = express.Router();

const User = require("../models/User");

router.post(
    "/signup",
    body("username")
        .isString()
        .withMessage("Please enter a valid username")
        .matches(/^\w+$/)
        .withMessage("Usernames can only contain letters, numbers and underscores.")
        .custom((input) => {
            return new Promise(async (resolve, reject) => {
                try{
                    const user = await User.findOne({ username: input });

                    if(user){
                        reject(new Error("A user with this username already exists"));
                    } else {
                        resolve();
                    }
                } catch {
                    reject(new Error("Failed to validate your username, please try again."));
                }
            })
        }),
    body("email")
        .isString()
        .withMessage("Please enter a valid email address")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .custom((input) => {
            return new Promise(async (resolve, reject) => {
                try{
                    const user = await User.findOne({ email: input });

                    if(user){
                        reject(new Error("You already have an account, did you forget your password?"));
                    } else {
                        resolve();
                    }
                } catch {
                    reject(new Error("Failed to validate your email address, please try again."));
                }
            })
        }),
    body("password")
        .isString()
        .withMessage("Please enter a valid password")
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 })
        .withMessage("Your password must be at least 8 characters long and contain 1 lowecase, 1 uppercase and a number.")
        .custom((input, { req }) => {
            return new Promise((resolve, reject) => {
                if(req.body.confirm_password && req.body.confirm_password === input){
                    resolve(true);
                } else {
                    reject(new Error("The passwords don't match, please try again."));
                }
            });
        }),
    validateErrors,
    signup
);

router.post(
    "/signin",
    body("email")
        .isString()
        .withMessage("Please enter a valid email address")
        .isEmail()
        .withMessage("Please enter a valid email address"),
    body("password")
        .isString()
        .withMessage("Please enter a valid password"),
    validateErrors,
    signin
);

router.get("/", (req, res) => {
    if(req.session.user_id){
        return res.send({ user_id: req.session.user_id });
    } else {
        return res.send("Not logged in");
    }
});
module.exports = router;