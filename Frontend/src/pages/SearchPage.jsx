import { useCallback, useState } from 'react';
import Banner from '../components/Banner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ResultCard from '../components/ResultCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import useAuth from '../hooks/useAuth.js';
import useGeolocation from '../hooks/useGeolocation.js';
import useStockSocket from '../hooks/useStockSocket.js';
import { searchMedicines } from '../api/search.api.js';
import { createReservation } from '../api/reservation.api.js';
import { apiErrorMessage } from '../utils/format.js';
import { ROLES } from '../utils/constants.js';

export default function SearchPage() {
  const { user } = useAuth();
  const location = useGeolocation();
  const [query, setQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(10);
  const [sortBy, setSortBy] = useState('distance');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [reservationModal, setReservationModal] = useState(null);

  useStockSocket(
    useCallback(({ pharmacyId, medicineId, available }) => {
      setResults((current) =>
        current.map((item) =>
          item.pharmacy._id === pharmacyId && item.medicine._id === medicineId
            ? { ...item, available }
            : item
        )
      );
    }, [])
  );

  async function runSearch(event) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      setResults(
        await searchMedicines({
          q: query,
          lat: location.lat,
          lng: location.lng,
          radiusKm,
          sortBy
        })
      );
      setSearched(true);
    } catch (error) {
      setMessage({ type: 'error', text: apiErrorMessage(error, 'Search failed') });
    } finally {
      setLoading(false);
    }
  }

  async function handleReserve(item) {
    setReservationModal({ item, quantity: 1 });
  }

  async function confirmReservation() {
    if (!reservationModal || !reservationModal.quantity) return;

    const { item, quantity } = reservationModal;

    try {
      const reservation = await createReservation(item.inventoryId, quantity);

      // Generate a countdown for pickup code validity (4 hours)
      const expiryTime = new Date(Date.now() + 4 * 60 * 60 * 1000);
      const timeStr = expiryTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      setMessage({
        type: 'success',
        text: `✓ Reserved ${quantity}x ${item.medicine.name}. Pickup code: ${reservation.code}. Valid until ${timeStr}.`
      });

      setResults((current) =>
        current.map((row) =>
          row.inventoryId === item.inventoryId
            ? { ...row, available: Math.max(0, row.available - quantity) }
            : row
        )
      );

      setReservationModal(null);
    } catch (error) {
      setMessage({ type: 'error', text: apiErrorMessage(error, 'Could not reserve') });
    }
  }

  return (
    <div className="page">
      <section className="hero">
        <h1>Find your medicine, in stock, near you.</h1>
        <p>Live inventory from local pharmacies — search, compare, reserve, collect.</p>
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
          onSubmit={runSearch}
          loading={loading}
        />
        <small className="muted">
          Searching around {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </small>
      </section>

      {message && <Banner type={message.type}>{message.text}</Banner>}

      {searched && results.length > 0 && (
        <div className="sort-controls">
          <label>
            Sort by:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="distance">Distance (nearest first)</option>
              <option value="price">Price (cheapest first)</option>
              <option value="available">Stock (most available first)</option>
            </select>
          </label>
          <button type="button" onClick={runSearch} disabled={loading}>
            Re-sort
          </button>
        </div>
      )}

      {searched && results.length === 0 && (
        <EmptyState>No pharmacy nearby has that medicine in stock. Try a wider radius.</EmptyState>
      )}

      <div className="cards">
        {results.map((item) => (
          <ResultCard
            key={item.inventoryId}
            item={item}
            canReserve={user?.role === ROLES.PATIENT}
            onReserve={handleReserve}
          />
        ))}
      </div>

      {/* Reservation Modal */}
      {reservationModal && (
        <div className="modal-overlay" onClick={() => setReservationModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reserve {reservationModal.item.medicine.name}</h3>
            <p>
              <strong>{reservationModal.item.pharmacy.name}</strong>
              <br />
              Available: {reservationModal.item.available} units
            </p>

            <div className="form-group">
              <label>
                Quantity:
                <input
                  type="number"
                  min="1"
                  max={reservationModal.item.available}
                  value={reservationModal.quantity}
                  onChange={(e) =>
                    setReservationModal({
                      ...reservationModal,
                      quantity: Math.min(reservationModal.item.available, Math.max(1, parseInt(e.target.value) || 1))
                    })
                  }
                />
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={confirmReservation}>
                Confirm Reservation
              </button>
              <button type="button" onClick={() => setReservationModal(null)} className="secondary">
                Cancel
              </button>
            </div>

            <small className="muted">
              ℹ️ Your pickup code will be valid for 4 hours. Show it at the pharmacy to collect.
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
