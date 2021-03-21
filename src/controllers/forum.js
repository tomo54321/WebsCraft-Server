const Forum = require("../models/Forum");
// All Forums that don't have a category
exports.index = async (req, res) => {
    try {

        const forums = await Forum.find({
            category: null
        });

        return res.send(
            forums.map(forum => ({
                id: forum.id,
                name: forum.name,
                description: forum.description
            }))
        );

    } catch {
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch forums"
            }]
        })
    }
};

// Get single forum by it's id
exports.get = async (req, res) => {
    try {
        const forum = await Forum.findOne({
            _id: req.params.forumId
        }).populate("category");
        if(!forum){
            throw new Error("Forum not found!");
        }

        return res.send({
            id: forum.id,
            name: forum.name,
            description: forum.description,
            category: forum.category
        })

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

// Create a forum
exports.create = async (req, res) => {

    
    const forum = new Forum({
        name: req.body.name,
        description: req.body.description,
        category: req.parentForumCategory || null
    });
    
    try {
        await forum.save();

        // The parent category isn't null?
        if(req.parentForumCategory){
            req.parentForumCategory.forums.push(forum.id);
            await req.parentForumCategory.save();
        }

        return res.send({
            ok: true,
            forum: forum.id
        })
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to create forum, please try again."
            }]
        })
    }
};

// Update a forum
exports.update = async (req, res) => {
    try {
        const forum = await Forum.findOne({
            _id: req.params.forumId
        }).populate("category");
        
        if(!forum){
            throw new Error("Forum not found!");
        }
        forum.name = req.body.name;
        forum.description = req.body.description;

        // We're changing the parent category
        if(forum.category !== req.parentForumCategory){
            // The existing category isn't null?
            if(forum.category){
                // Remove this forum from the OLD category
                const oldIndex = forum.category.forums.findIndex(catForum => catForum.id === forum.id);
                forum.category.forums.splice(oldIndex, 1);
                await forum.category.save();
            }
            // The new category isn't null?
            if(req.parentForumCategory){
                req.parentForumCategory.forums.push(forum.id);
                await req.parentForumCategory.save();
            }
        }

        forum.category = req.parentForumCategory || null;
        await forum.save();

        return res.send({
            ok: true,
            forum: {
                name: forum.name,
                description: forum.description,
                category: forum.category ? {
                    id: forum.category.id,
                    name: forum.category.name,
                    slug: forum.category.slug,
                } : null
            }
        })

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

// Delete a forum
exports.destroy = async (req, res) => {
    try {
        const forum = await Forum.findById(req.params.forumId);
        if(!forum){
            throw new Error("Forum not found!");
        }

        await forum.delete();

        return res.send({
            ok: true
        })

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