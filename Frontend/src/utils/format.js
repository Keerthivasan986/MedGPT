export const formatCurrency = (value) => `\u20B9${Number(value || 0).toFixed(2)}`;

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export const formatDistance = (km) => (km === null || km === undefined ? '' : `${km} km away`);

export const apiErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || fallback;

export const formatTimeAgo = (date) => {
  if (!date) return '—';
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const formatMinutesUntilClose = (minutes) => {
  if (minutes === null || minutes === undefined) return null;
  if (minutes < 60) return `${Math.round(minutes)}m`;
  return `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}m`;
};

export const parseSavings = (price, alternativePrice) => {
  const savings = alternativePrice - price;
  return {
    amount: Math.abs(savings),
    percent: Math.abs((savings / price) * 100).toFixed(1),
    isCheaper: savings < 0
  };
};
