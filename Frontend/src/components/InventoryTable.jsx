import { formatCurrency, formatDate } from '../utils/format.js';

export default function InventoryTable({ inventory, onAdjust }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Medicine</th>
          <th>On hand</th>
          <th>Reserved</th>
          <th>Available</th>
          <th>Price</th>
          <th>Expiry</th>
          <th>Quick adjust</th>
        </tr>
      </thead>
      <tbody>
        {inventory.map((item) => (
          <tr key={item._id}>
            <td>
              {item.medicine?.name} <span className="muted">{item.medicine?.strength}</span>
            </td>
            <td>{item.quantity}</td>
            <td>{item.reserved}</td>
            <td>
              <span className={item.available > 0 ? 'pill in-stock' : 'pill out-stock'}>{item.available}</span>
            </td>
            <td>{formatCurrency(item.price)}</td>
            <td className="muted">{formatDate(item.expiryDate)}</td>
            <td className="actions">
              <button type="button" className="ghost" onClick={() => onAdjust(item, -1)}>
                −1
              </button>
              <button type="button" className="ghost" onClick={() => onAdjust(item, 1)}>
                +1
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
