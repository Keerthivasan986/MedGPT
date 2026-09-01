import { User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { extractBearerToken, verifyToken } from '../utils/token.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization || '');
  if (!token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('Invalid token');

  req.user = user;
  next();
});

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return next(ApiError.forbidden(`Requires ${role} role`));
    return next();
  };
}
