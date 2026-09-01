export default function StockForm({ form, medicines, onChange, onSubmit }) {
  const update = (field) => (event) => onChange({ ...form, [field]: event.target.value });

  return (
    <form className="row-form" onSubmit={onSubmit}>
      <select value={form.medicineId} onChange={update('medicineId')} required>
        <option value="">Select medicine</option>
        {medicines.map((medicine) => (
          <option key={medicine._id} value={medicine._id}>
            {medicine.name} — {medicine.brand} {medicine.strength}
          </option>
        ))}
      </select>
      <input type="number" min="0" placeholder="Quantity" value={form.quantity} onChange={update('quantity')} required />
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Price ₹"
        value={form.price}
        onChange={update('price')}
        required
      />
      <input type="date" value={form.expiryDate} onChange={update('expiryDate')} />
      <button type="submit">Save stock</button>
    </form>
  );
}
