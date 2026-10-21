import { useState } from 'react';
import StockPill from './StockPill.jsx';
import { formatCurrency, formatDistance, formatTimeAgo, formatMinutesUntilClose } from '../utils/format.js';

export default function ResultCard({ item, canReserve, onReserve }) {
  const { medicine, pharmacy } = item;
  const [showAlternatives, setShowAlternatives] = useState(false);

  const getGoogleMapsUrl = () =>
    `https://www.google.com/maps/search/${encodeURIComponent(pharmacy.name + ' ' + pharmacy.address)}`;
  const getDirectionsUrl = () =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pharmacy.address)}`;
  const getCallUrl = () => `tel:${pharmacy.phone}`;

  const isLowStock = item.available < 5;
  const isClosing = item.pharmacyOpen && item.minutesUntilClose && item.minutesUntilClose < 60;
  const isClosed = !item.pharmacyOpen;

  return (
    <article className="card">
      <header>
        <div>
          <h3>
            {medicine.name} <span className="muted">{medicine.strength}</span>
          </h3>
          <small className="muted">Updated {formatTimeAgo(item.updatedAt)}</small>
        </div>
        <StockPill available={item.available} />
      </header>

      {/* Warnings */}
      <div className="badges">
        {isLowStock && <span className="badge warning">Low stock</span>}
        {item.isNearExpiry && <span className="badge alert">Near expiry</span>}
        {isClosing && <span className="badge alert">Closes in {formatMinutesUntilClose(item.minutesUntilClose)}</span>}
        {isClosed && <span className="badge alert">Closed</span>}
      </div>

      <p className="muted">
        {medicine.brand} · {medicine.composition}
        {medicine.prescriptionRequired && <strong> · Prescription required</strong>}
      </p>

      {/* Pharmacy Info */}
      <div className="pharmacy-info">
        <strong>{pharmacy.name}</strong>
        <br />
        <small>
          {pharmacy.address}, {pharmacy.city}
          <br />
          {pharmacy.openingHours && <span>Hours: {pharmacy.openingHours}</span>}
        </small>
        <div className="pharmacy-actions">
          <a href={getCallUrl()} title="Call pharmacy">
            📞 {pharmacy.phone}
          </a>
          <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer" title="Get directions">
            📍 Directions
          </a>
        </div>
      </div>

      <footer>
        <div className="pricing">
          <span className="price">{formatCurrency(item.price)}</span>
          <span className="muted">{formatDistance(item.distanceKm)}</span>
        </div>
        <button
          type="button"
          onClick={() => onReserve(item)}
          disabled={!canReserve || item.available < 1 || isClosed}
          title={
            isClosed
              ? 'Pharmacy is closed'
              : canReserve
                ? undefined
                : 'Sign in as a patient to reserve'
          }
        >
          Reserve
        </button>
      </footer>

      {/* Toggle alternatives */}
      <button
        type="button"
        className="link-button"
        onClick={() => setShowAlternatives(!showAlternatives)}
        style={{ marginTop: '8px', fontSize: '0.9em' }}
      >
        {showAlternatives ? '▼ Hide alternatives' : '▶ See alternatives'}
      </button>

      {showAlternatives && (
        <div className="alternatives-section" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #ddd' }}>
          <small>Generic/cheaper alternatives with same composition available nearby.</small>
        </div>
      )}
    </article>
  );
}
