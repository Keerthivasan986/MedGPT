import { RADIUS_OPTIONS } from '../utils/constants.js';

export default function SearchBar({ query, onQueryChange, radiusKm, onRadiusChange, onSubmit, loading }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Medicine, brand or composition (e.g. Paracetamol)"
        aria-label="Medicine name"
      />
      <select value={radiusKm} onChange={(e) => onRadiusChange(Number(e.target.value))} aria-label="Radius">
        {RADIUS_OPTIONS.map((km) => (
          <option key={km} value={km}>
            Within {km} km
          </option>
        ))}
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
