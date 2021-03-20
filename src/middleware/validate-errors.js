const { validationResult } = require('express-validator');
module.exports = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json(errors.array());
      return res.status(400).json({ 
          message: errors.array()[0].msg,
          field: errors.array()[0].param
        });
    }

    next();
};