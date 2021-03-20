const User = require("../models/User");

module.exports = async (req, res, next) => {

    if(!req.session.user_id){
        return res.status(403).send({
            errors: [{
                param: "user",
                msg: "You are not logged in."
            }]
        })
    };

    try {
        const user = await User.findById(req.session.user_id);
        if(!user){
            return res.status(403).send({
                errors: [{
                    param: "user",
                    msg: "You are not logged in."
                }]
            })
        }
        req.auth_user = user;
        next();
    } catch {
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to verify your account."
            }]
        })
    }

};