export const colors = [
  "Red",
  "Green",
  "Blue",
  "Purple",
  "Black",
  "Gray",
  "Pink",
  "White",
  "Orange",
  "Tan",
  "Brown",
  "Silver",
];

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const years = Array.from({ length: 50 }, (_, i) =>
  String(new Date().getFullYear() + 1 - i)
);
