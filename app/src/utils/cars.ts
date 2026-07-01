export const years = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() + 1 - i,
);

export const colorMap = {
  red: "#ca3f3f",
  green: "#62be62",
  blue: "#4285ea",
  purple: "#a837b7",
  black: "#2b2b2b",
  gray: "#a8a8a8",
  pink: "#d36ecb",
  white: "#e2e2e2",
  orange: "#d8670a",
  tan: "#c69567",
  brown: "#78513edd",
  silver: "#7e7e7e",
  yellow: "#ffc72f",
};
