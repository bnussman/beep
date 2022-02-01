export function printStars(rating: number | null | undefined): string {
  if (!rating) return "";

  let stars = "";

  for (let i = 0; i < rating; i++) {
    stars += "⭐️ ";
  }

  return stars;
}
