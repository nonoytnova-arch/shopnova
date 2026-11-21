const { validationResult } = require('express-validator');

// Place this after any express-validator check()/body()/param() chain in a route.
// If any validator failed, it stops the request with a 400 and a list of field errors
// instead of letting bad data reach the controller.
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
    });
  }
  next();
}

module.exports = { handleValidationErrors };
