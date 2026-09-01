import asyncHandler from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { token, user } = await authService.register(req.body);
  res.status(201).json({ token, user });
});

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  res.json({ token, user });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
