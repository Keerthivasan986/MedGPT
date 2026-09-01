import { useCallback, useEffect, useState } from 'react';
import Banner from '../components/Banner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import InventoryTable from '../components/InventoryTable.jsx';
import StockForm from '../components/StockForm.jsx';
import { fetchMyInventory, saveStock } from '../api/inventory.api.js';
import { fetchMedicines } from '../api/medicine.api.js';
import { apiErrorMessage } from '../utils/format.js';

const EMPTY_FORM = { medicineId: '', quantity: '', price: '', expiryDate: '' };

export default function DashboardPage() {
  const [inventory, setInventory] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState(null);

  const load = useCallback(() => {
    fetchMyInventory().then(setInventory).catch(() => {});
    fetchMedicines().then(setMedicines).catch(() => {});
  }, []);

  useEffect(load, [load]);

  async function submitStock(event) {
    event.preventDefault();
    setMessage(null);
    try {
      await saveStock({
        medicineId: form.medicineId,
        quantity: Number(form.quantity),
        price: Number(form.price),
        expiryDate: form.expiryDate || undefined
      });
      setForm(EMPTY_FORM);
      setMessage({ type: 'success', text: 'Stock updated — patients see it instantly.' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: apiErrorMessage(err, 'Update failed') });
    }
  }

  async function adjust(item, delta) {
    try {
      await saveStock({
        medicineId: item.medicine._id,
        quantity: Math.max(item.quantity + delta, 0),
        price: item.price,
        expiryDate: item.expiryDate
      });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: apiErrorMessage(err, 'Update failed') });
    }
  }

  return (
    <div className="page">
      <h2>Pharmacy stock dashboard</h2>
      {message && <Banner type={message.type}>{message.text}</Banner>}

      <StockForm form={form} medicines={medicines} onChange={setForm} onSubmit={submitStock} />

      {inventory.length === 0 ? (
        <EmptyState>No stock lines yet — add your first medicine above.</EmptyState>
      ) : (
        <InventoryTable inventory={inventory} onAdjust={adjust} />
      )}
    </div>
  );
}
