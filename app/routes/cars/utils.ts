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

export const years = Array.from({ length: 50 }, (_, i) =>
  String(new Date().getFullYear() + 1 - i)
);
