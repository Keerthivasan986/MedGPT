import asyncHandler from '../utils/asyncHandler.js';
import * as searchService from '../services/search.service.js';

export const search = asyncHandler(async (req, res) => {
  const { q, lat, lng, radiusKm, inStockOnly = 'true' } = req.query;
  const results = await searchService.searchMedicines({
    q,
    lat,
    lng,
    radiusKm,
    inStockOnly: inStockOnly === 'true'
  });
  res.json({ query: q, count: results.length, results });
});
