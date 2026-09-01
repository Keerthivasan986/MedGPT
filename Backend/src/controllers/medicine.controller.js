import asyncHandler from '../utils/asyncHandler.js';
import * as medicineService from '../services/medicine.service.js';

export const list = asyncHandler(async (req, res) => {
  res.json({ medicines: await medicineService.listMedicines(req.query.q) });
});

export const create = asyncHandler(async (req, res) => {
  res.status(201).json({ medicine: await medicineService.createMedicine(req.body) });
});
