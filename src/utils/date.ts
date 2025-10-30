const toYYYYMMDDUTC = (d: Date) => d.toISOString().slice(0, 10);

export function monthRangeYYYYMMDDUTC(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth();
  const start = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, m + 1, 0, 0, 0, 0, 0));
  return { start: toYYYYMMDDUTC(start), end: toYYYYMMDDUTC(end) };
}
