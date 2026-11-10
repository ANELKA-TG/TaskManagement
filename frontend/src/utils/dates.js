const pad = (n) => String(n).padStart(2, '0');

// Date object -> "YYYY-MM-DD" (using the local calendar day)
export const toISODate = (date) =>
  date
    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    : '';

// "YYYY-MM-DD" (or a full ISO string) -> Date at local midnight
export const parseISODate = (value) => {
  if (!value) return null;
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

// "2026-11-28..." -> "28/11/2026"
export const formatDueDate = (value) => {
  if (!value) return '';
  const [y, m, d] = value.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};

// A timestamp (like createdAt) -> its local calendar day as "dd/mm/yyyy"
export const formatCreatedDate = (value) =>
  formatDueDate(toISODate(new Date(value)));