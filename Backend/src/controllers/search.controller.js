import asyncHandler from '../utils/asyncHandler.js';
import * as searchService from '../services/search.service.js';

export const search = asyncHandler(async (req, res) => {
  const { q, lat, lng, radiusKm, inStockOnly = 'true', sortBy = 'distance' } = req.query;
  const results = await searchService.searchMedicines({
    q,
    lat,
    lng,
    radiusKm,
    inStockOnly: inStockOnly === 'true',
    sortBy
  });
  res.json({ query: q, count: results.length, results });
});

export const getSubstitutes = asyncHandler(async (req, res) => {
  const { medicineId } = req.params;
  const substitutes = await searchService.getGenericSubstitutes(medicineId);
  res.json({ medicineId, count: substitutes.length, substitutes });
});

export const getCheapestAlternative = asyncHandler(async (req, res) => {
  const { medicineId, pharmacyId } = req.params;
  const { radiusKm, lat, lng } = req.query;
  const alternative = await searchService.getCheapestAlternative({
    medicineId,
    pharmacyId,
    radiusKm: radiusKm ? Number(radiusKm) : 10,
    lat: lat ? Number(lat) : undefined,
    lng: lng ? Number(lng) : undefined
  });
  res.json({ alternative });
});
