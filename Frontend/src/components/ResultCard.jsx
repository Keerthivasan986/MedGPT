import StockPill from './StockPill.jsx';
import { formatCurrency, formatDistance } from '../utils/format.js';

export default function ResultCard({ item, canReserve, onReserve }) {
  const { medicine, pharmacy } = item;

  const isPharmacyOpen = () => {
    // Simple check: if opening hours exist, assume open (more complex logic can be added)
    return !!pharmacy.openingHours;
  };

  const handleLocation = () => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
      `${pharmacy.name}, ${pharmacy.address}, ${pharmacy.city}`
    )}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <article className="card">
      <header>
        <h3>
          {medicine.name} <span className="muted">{medicine.strength}</span>
        </h3>
        <StockPill available={item.available} />
      </header>
      <p className="muted">
        {medicine.brand} · {medicine.composition}
        {medicine.prescriptionRequired && <strong> · Prescription required</strong>}
      </p>
      <p>
        <strong>{pharmacy.name}</strong>
        <br />
        <button
          type="button"
          onClick={handleLocation}
          className="location-link"
          title="Open location in Google Maps"
        >
          {pharmacy.address}, {pharmacy.city}
        </button>
        · {pharmacy.phone}
        <br />
        <span className="muted">
          {pharmacy.openingHours}{' '}
          <span className={isPharmacyOpen() ? 'open' : 'closed'}>
            {isPharmacyOpen() ? '● Open' : '● Closed'}
          </span>
        </span>
      </p>
      <footer>
        <span className="price">{formatCurrency(item.price)}</span>
        <span className="muted">{formatDistance(item.distanceKm)}</span>
        <button
          type="button"
          onClick={() => onReserve(item)}
          disabled={!canReserve || item.available < 1}
          title={canReserve ? undefined : 'Sign in as a patient to reserve'}
        >
          Reserve
        </button>
      </footer>
    </article>
  );
}
