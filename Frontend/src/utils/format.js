export const formatCurrency = (value) => `\u20B9${Number(value || 0).toFixed(2)}`;

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export const formatDistance = (km) => (km === null || km === undefined ? '' : `${km} km away`);

export const apiErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || fallback;
