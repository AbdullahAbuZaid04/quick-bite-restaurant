'use strict';

const { BadRequestError } = require('../utils/errors');

/**
 * Build a middleware that validates `req[source]` against a Joi schema.
 *
 *   router.post('/menu', validate(menuSchema, 'body'), handler);
 *
 * On success, `req[source]` is replaced by the *cleaned*, coerced value
 * (strings trimmed, numbers parsed, unknown keys removed when configured).
 */
function validate(schema, source = 'body') {
  return function validateMiddleware(req, _res, next) {
    if (!schema || typeof schema.validate !== 'function') {
      return next(new Error('validate(): a Joi schema is required'));
    }

    const { value, error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        path: d.path.join('.'),
        message: d.message,
      }));
      return next(new BadRequestError('Validation failed', details));
    }

    req[source] = value;
    return next();
  };
}

module.exports = validate;
