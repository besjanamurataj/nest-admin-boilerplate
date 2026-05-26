export function parseAlbanianDate(value?: any): Date | null {
  if (!value) return null;

  const [d, m, y] = value.split('/');
  return new Date(+y, +m - 1, +d);
}
