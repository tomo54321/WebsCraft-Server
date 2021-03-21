const Thread = require("../models/Thread");
// All replies in the thread
exports.index = async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page || 1);

        await req.parentThread.populate({
            path: "replies",
            populate: {
                path: "user",
                select: {
                    id: 1,
                    username: 1
                }
            }
        });

        let replies = paginate(req.parentThread.replies, 10, currentPage);

        return res.send(replies);

    } catch (e) {
        console.log(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch replies"
            }]
        })
    }
};

exports.create = async (req, res) => {
    if(req.parentThread.locked){
        return res.status(403).send({
            errors: [{
                param: "thread",
                msg: "Cannot create reply because the thread is locked."
            }]
        })
    }

    try{
        const reply = {
            user: req.auth_user,
            reply: req.body.content
        };
        req.parentThread.replies.push(reply);
        await req.parentThread.save();
        return res.send({
            ok: true,
            reply: {
                id: Date.now(),
                reply: reply.reply,
                user: {
                    id: reply.user.id, 
                    username: reply.user.username
                }
            }
        })
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to create reply"
            }]
        })
    }

};

exports.update = async (req, res) => { 
    if(req.parentThread.locked){
        return res.status(403).send({
            errors: [{
                param: "thread",
                msg: "Cannot update reply because the thread is locked."
            }]
        })
    }

    try {
        await Thread.findOneAndUpdate({
            _id: req.parentThread.id,
            "replies._id": req.params.replyId
        }, {
            $set: {
                "replies.$.reply": req.body.content
            }
        });

        return res.send({
            ok: true,
            reply: {
                id: req.params.replyId,
                reply: req.body.content
            }
        })
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch reply"
            }]
        })
    }
}

exports.destroy = async (req, res) => { 
    if(req.parentThread.locked){
        return res.status(403).send({
            errors: [{
                param: "thread",
                msg: "Cannot delete reply because the thread is locked."
            }]
        })
    }

    try{

        if(req.parentThread.replies[0].id === req.params.replyId){
            return res.status(400).send({
                errors: [{
                    param: "replyId",
                    msg: "You cannot remove the starting reply for the thread."
                }]
            })
        }

        const replyIndex = req.parentThread.replies.findIndex(reply => reply.id === req.params.replyId);
        if(replyIndex === -1){
            return res.status(404).send({
                errors: [{
                    param: "replyId",
                    msg: "Reply not found."
                }]
            })
        }

        req.parentThread.replies.splice(replyIndex, 1);

        await req.parentThread.save();

        return res.send({ ok: true });

    } catch (e) {
        console.log(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch reply"
            }]
        })
    }

};


function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }