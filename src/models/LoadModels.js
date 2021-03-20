module.exports = () => {
    return new Promise((resolve) => {
        const models = [
            "Category",
            "Forum",
            "Reply",
            "Thread",
            "User"
        ];
        models.forEach((name) => require(`./${name}`));

        resolve();
    });
};