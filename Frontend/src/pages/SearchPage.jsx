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
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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
      setResults(await searchMedicines({ q: query, lat: location.lat, lng: location.lng, radiusKm }));
      setSearched(true);
    } catch (error) {
      setMessage({ type: 'error', text: apiErrorMessage(error, 'Search failed') });
    } finally {
      setLoading(false);
    }
  }

  async function reserve(item) {
    const quantity = Number(window.prompt(`How many units of ${item.medicine.name}?`, '1'));
    if (!quantity || quantity < 1) return;
    try {
      const reservation = await createReservation(item.inventoryId, quantity);
      setMessage({
        type: 'success',
        text: `Reserved ${quantity} x ${item.medicine.name}. Pickup code ${reservation.code} — valid 4 hours.`
      });
      setResults((current) =>
        current.map((row) =>
          row.inventoryId === item.inventoryId ? { ...row, available: row.available - quantity } : row
        )
      );
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

      {searched && results.length === 0 && (
        <EmptyState>No pharmacy nearby has that medicine in stock. Try a wider radius.</EmptyState>
      )}

      <div className="cards">
        {results.map((item) => (
          <ResultCard
            key={item.inventoryId}
            item={item}
            canReserve={user?.role === ROLES.PATIENT}
            onReserve={reserve}
          />
        ))}
      </div>
    </div>
  );
}
