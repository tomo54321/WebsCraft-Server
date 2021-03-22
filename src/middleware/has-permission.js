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

        // Check if user has at least one of the specified permissions?
        if(permission instanceof Array) {

            let hasAPermission = false;
            for(let i = 0; i < permission.length; ++i){
                if(req.auth_user.permissions.includes(permission[i])){
                    hasAPermission = true;
                    continue;
                }
            }
            
            if(!hasAPermission){
                return res.status(403).send({
                    errors: [{
                        param: "user",
                        msg: "You do not have permission to do this."
                    }]
                })
            }


        } else { // Check if the user has one permission
            if(!req.auth_user.permissions.includes(permission)){
                return res.status(403).send({
                    errors: [{
                        param: "user",
                        msg: "You do not have permission to do this."
                    }]
                })
            }
        }

        next();
    };

};