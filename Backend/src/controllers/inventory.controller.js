import asyncHandler from '../utils/asyncHandler.js';
import * as inventoryService from '../services/inventory.service.js';

export const mine = asyncHandler(async (req, res) => {
  res.json({ inventory: await inventoryService.listPharmacyStock(req.user.pharmacy) });
});

export const upsert = asyncHandler(async (req, res) => {
  res.json({ inventory: await inventoryService.upsertStock(req.user.pharmacy, req.body) });
});

export const remove = asyncHandler(async (req, res) => {
  await inventoryService.removeStock(req.user.pharmacy, req.params.id);
  res.json({ message: 'Stock entry removed' });
});
