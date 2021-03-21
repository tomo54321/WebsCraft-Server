const Thread = require("../models/Thread");
// All threads in the forum
exports.index = async (req, res) => {
    try {

        const threads = await Thread.find({
            forum: req.parentForum.id
        });

        return res.send(
            threads.map(thread => ({
                id: thread.id,
                title: thread.title,
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
                path: "user"
            }
        }).populate("forum");
        if(!thread){
            throw new Error("Thread not found!");
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
            forum: req.params.forumId
        }).populate("category");
        
        if(!thread){
            throw new Error("Thread not found!");
        }
        thread.title = req.body.title;
        thread.locked = req.body.locked || false;
        await forum.save();

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
            throw new Error("Thread not found!");
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