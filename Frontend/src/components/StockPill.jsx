export default function StockPill({ available }) {
  return (
    <span className={available > 0 ? 'pill in-stock' : 'pill out-stock'}>
      {available > 0 ? `${available} in stock` : 'Out of stock'}
    </span>
  );
}
