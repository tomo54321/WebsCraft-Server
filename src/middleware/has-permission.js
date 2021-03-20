module.exports = (permission) => {

    return (req, res, next) => {
        
        if(!req.auth_user){
            return res.status(403).send({
                errors: [{
                    param: "user",
                    msg: "You are not logged in."
                }]
            })
        }
        if(!req.auth_user.permissions.includes(permission)){
            return res.status(403).send({
                errors: [{
                    param: "user",
                    msg: "You do not have permission to do this."
                }]
            })
        }

        next();
    };

};