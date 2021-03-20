const User = require("../models/User");
const bcrypt = require("bcrypt");
exports.signup = async (req, res) => {

    const hash = await bcrypt.hash(req.body.password, 12);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash
    });
    
    try{
        await user.save();
        return res.send({ ok: true });
    } catch (e) {
        return res.status(500).send({
            errors: [{
                param: "user",
                msg: "Failed to create account, please try again."
            }]
        })
    }
};

exports.signin = async (req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            return res.status(401).send({
                errors: [{
                    param: "email",
                    msg: "Either your email or password was incorrect."
                }]
            })
        }

        const passwordStatus = await bcrypt.compare(req.body.password, user.password);
        if(!passwordStatus){
            return res.status(401).send({
                errors: [{
                    param: "email",
                    msg: "Either your email or password was incorrect."
                }]
            })
        }

        req.session.user_id = user.id;

        return res.send({
            ok: true,
            user: {
                id: user.id,
                username: user.username,
                created_at: user.createdAt
            }
        })


    } catch {
        return res.status(500).send({
            errors: [{
                param: "user",
                msg: "Failed to verify your email and/or password, please try again."
            }]
        })
    }
};