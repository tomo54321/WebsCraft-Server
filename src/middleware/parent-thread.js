const Thread = require("../models/Thread");

module.exports = async (req, res, next) => {

    try{
        const thread = await Thread.findOne({
            _id: req.params.threadId,
            forum: req.params.forumId
        }).populate({
            path: "replies.user",
            select: {
                id: 1,
                username: 1
            }
        });
        if(!thread){
            return res.status(404).send({
                errors: [{
                    param: "threadId",
                    msg: "The thread doesn't exist, please try again."
                }]
            })
        
        }
        req.parentThread = thread;

        next();
        
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch thread, please try again."
            }]
        })
    }

};