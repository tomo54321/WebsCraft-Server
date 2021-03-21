const Forum = require("../models/Forum");

module.exports = async (req, res, next) => {

    try{
        const forum = await Forum.findOne({
            _id: req.params.forumId
        });
        if(!forum){
            return res.status(404).send({
                errors: [{
                    param: "forumId",
                    msg: "The forum doesn't exist, please try again."
                }]
            })
        
        }
        req.parentForum = forum;

        next();
        
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch forum, please try again."
            }]
        })
    }

};