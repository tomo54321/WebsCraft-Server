const Category = require("../models/Category");
// All Categories
exports.index = async (req, res) => {
    try{

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

exports.create = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    });

    try{
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