export function parseAlbanianDate(value?: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const parts = value.split('/');

  if (parts.length !== 3) return null;

  const [d, m, y] = parts;

  const day = Number(d);
  const month = Number(m);
  const year = Number(y);

  if (!day || !month || !year) return null;

  const date = new Date(year, month - 1, day);

  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
}
