import { useCallback, useEffect, useState } from 'react';
import Banner from '../components/Banner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useAuth from '../hooks/useAuth.js';
import { fetchMyReservations, updateReservationStatus } from '../api/reservation.api.js';
import { apiErrorMessage } from '../utils/format.js';
import { ROLES } from '../utils/constants.js';

export default function ReservationsPage() {
  const { user } = useAuth();
  const isPharmacist = user?.role === ROLES.PHARMACIST;
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    fetchMyReservations()
      .then(setReservations)
      .catch((err) => setError(apiErrorMessage(err, 'Could not load reservations')));
  }, []);

  useEffect(load, [load]);

  async function changeStatus(id, status) {
    try {
      await updateReservationStatus(id, status);
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Update failed'));
    }
  }

  return (
    <div className="page">
      <h2>{isPharmacist ? 'Incoming reservations' : 'My reservations'}</h2>
      <Banner type="error">{error}</Banner>
      {reservations.length === 0 ? (
        <EmptyState>No reservations yet.</EmptyState>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Medicine</th>
              <th>{isPharmacist ? 'Patient' : 'Pharmacy'}</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.code}</td>
                <td>{reservation.medicine?.name}</td>
                <td>
                  {isPharmacist
                    ? `${reservation.patient?.name} (${reservation.patient?.phone || 'no phone'})`
                    : reservation.pharmacy?.name}
                </td>
                <td>{reservation.quantity}</td>
                <td>
                  <span className={`pill ${reservation.status}`}>{reservation.status}</span>
                </td>
                <td className="actions">
                  {reservation.status === 'pending' && isPharmacist && (
                    <button type="button" onClick={() => changeStatus(reservation._id, 'collected')}>
                      Mark collected
                    </button>
                  )}
                  {reservation.status === 'pending' && (
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => changeStatus(reservation._id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
