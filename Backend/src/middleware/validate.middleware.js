import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

// Runs a list of express-validator chains and rejects on the first failure set.
export function validate(chains) {
  return async (req, res, next) => {
    await Promise.all(chains.map((chain) => chain.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return next(ApiError.badRequest('Invalid input', errors.array()));
  };
}

export default validate;
