const Thread = require("../models/Thread");
// All threads in the forum
exports.index = async (req, res) => {
    try {

        const threads = await Thread.find({
            forum: req.parentForum.id
        }).populate({
            path: "replies",
            select: {
                id: 1,
                user: 1,
                reply: 1,
                createdAt: 1,
            },
            populate: {
                path: "user",
                select: {
                    id: 1,
                    username: 1
                }
            }
        });

        return res.send(
            threads.map(thread => ({
                id: thread.id,
                title: thread.title,
                totalReplies: thread.replies.length,
                reply: thread.replies[0],
                createdAt: thread.createdAt,
                updatedAt: thread.updatedAt
            }))
        );

    } catch {
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch threads"
            }]
        })
    }
};

// Get thread by it's id
exports.get = async (req, res) => {
    try {
        const thread = await Thread.findOne({
            _id: req.params.threadId,
            forum: req.parentForum.id
        }).populate({
            path: "replies",
            populate: {
                path: "user",
                select: {
                    id: 1,
                    username: 1
                }
            }
        })
        .slice("replies", 10)
        .populate("forum", "id name description");
        if(!thread){
            return res.status(404).send({
                errors:[{
                    param: "thread",
                    msg:"Thread not found!"
                }]
            });
        }

        return res.send(thread)

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

// Create a thread
exports.create = async (req, res) => {

    
    const thread = new Thread({
        title: req.body.title,
        forum: req.parentForum
    });

    // Add the initial reply
    const reply = {
        user: req.auth_user,
        reply: req.body.content
    };
    thread.replies = [reply];
    
    try {
        await thread.save();

        return res.send({
            ok: true,
            thread: thread.id
        })
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to create thread, please try again."
            }]
        })
    }
};

// Update a thread
exports.update = async (req, res) => {
    try {
        const thread = await Thread.findOne({
            _id: req.params.threadId,
            forum: req.parentForum.id
        }).populate("category");
        
        if(!thread){
            return res.status(404).send({
                errors:[{
                    param: "thread",
                    msg:"Thread not found!"
                }]
            });
        }
        
        // Not their thread and they don't have permission?
        if(thread.user !== req.auth_user && req.auth_user.permissions.includes("forum:adminUpdateReply")){
            return res.status(403).send({
                errors: [{
                    param: "user",
                    msg: "You do not have permission to do this."
                }]
            })
        }

        thread.title = req.body.title;
        thread.locked = req.body.locked || false;
        await thread.save();

        return res.send({
            ok: true,
            thread: {
                title: thread.title,
                locked: thread.locked,
            }
        })

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

// Lock a thread.
exports.lock = async (req, res) => {
    try {
        const thread = await Thread.findOne({
            _id: req.params.threadId,
            forum: req.parentForum.id
        });
        
        if(!thread || thread.locked){
            return res.status(404).send({
                errors:[{
                    param: "thread",
                    msg:"Thread not found or it is already locked!"
                }]
            });
        }

        // Not their thread and they don't have permission?
        if(thread.user !== req.auth_user && req.auth_user.permissions.includes("forum:adminUpdateReply")){
            return res.status(403).send({
                errors: [{
                    param: "user",
                    msg: "You do not have permission to do this."
                }]
            })
        }

        thread.locked = true;
        await thread.save();

        return res.send({
            ok: true,
            thread: {
                title: thread.name,
                locked: thread.locked,
            }
        })

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


// Delete a thread
exports.destroy = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.threadId);
        if(!thread){
            return res.status(404).send({
                errors:[{
                    param: "thread",
                    msg:"Thread not found!"
                }]
            });
        }

        // Not their thread and they don't have permission?
        if(thread.user !== req.auth_user && req.auth_user.permissions.includes("forum:adminUpdateReply")){
            return res.status(403).send({
                errors: [{
                    param: "user",
                    msg: "You do not have permission to do this."
                }]
            })
        }

        await thread.delete();

        return res.send({
            ok: true
        })

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