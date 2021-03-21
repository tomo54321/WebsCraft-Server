const Category = require("../models/Category");
const Forum = require("../models/Forum");
// All Categories
exports.index = async (req, res) => {
    try {

        const categories = await Category.find({})
            .populate("forums");

        return res.send(categories);

    } catch {
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch categories"
            }]
        })
    }
};

// Get single category by it's slug.
exports.get = async (req, res) => {
    try {
        const category = await Category.findOne({
            slug: req.params.categorySlug
        }).populate("forums");
        if(!category){
            throw new Error("Category not found!");
        }

        return res.send({
            name: category.name,
            description: category.description,
            slug: category.slug,
            forums: category.forums
        })

    } catch (e) {
        console.error(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch forum category, please try again."
            }]
        })

    }
};

// Create a category
exports.create = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    });

    try {
        await category.save();
        return res.send({
            ok: true,
            category: category.id
        })
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to create forum category, please try again."
            }]
        })
    }
};

// Update a category
exports.update = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if(!category){
            throw new Error("Category not found!");
        }
        category.name = req.body.name;
        category.description = req.body.description;
        await category.save();

        return res.send({
            ok: true,
            category: {
                name: category.name,
                description: category.description,
                slug: category.slug
            }
        })

    } catch (e) {
        console.error(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch forum category, please try again."
            }]
        })

    }
};

// Delete a category
exports.destroy = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if(!category){
            throw new Error("Category not found!");
        }

        await category.delete();

        return res.send({
            ok: true
        })

    } catch (e) {
        console.error(e);
        return res.status(500).send({
            errors: [{
                param: "server",
                msg: "Failed to fetch forum category, please try again."
            }]
        })

    }
};