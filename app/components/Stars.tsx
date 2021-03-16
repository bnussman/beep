export function printStars(rating: number): string {
    let stars = "";

    for (let i = 0; i < rating; i++){
        stars += "⭐️";
    }

    return stars;
}
