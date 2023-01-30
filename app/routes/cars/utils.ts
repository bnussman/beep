export const colors = [
  "red",
  "green",
  "blue",
  "purple",
  "black",
  "gray",
  "pink",
  "white",
  "orange",
  "tan",
  "brown",
  "silver",
];

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const years = Array.from({ length: 50 }, (_, i) =>
  String(new Date().getFullYear() + 1 - i)
);
