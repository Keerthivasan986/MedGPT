import asyncHandler from '../utils/asyncHandler.js';
import * as pharmacyService from '../services/pharmacy.service.js';

export const list = asyncHandler(async (req, res) => {
  const { lat, lng, radiusKm } = req.query;
  res.json({ pharmacies: await pharmacyService.listPharmacies({ lat, lng, radiusKm }) });
});

export const detail = asyncHandler(async (req, res) => {
  res.json({ pharmacy: await pharmacyService.getPharmacy(req.params.id) });
});

export const inventory = asyncHandler(async (req, res) => {
  res.json({ inventory: await pharmacyService.getPharmacyInventory(req.params.id) });
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ pharmacy: await pharmacyService.createPharmacy(req.body) });
});
