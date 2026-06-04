export const years = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() + 1 - i,
);
