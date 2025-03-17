function getRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getBeeperIcon() {
  const today = new Date();

  const day = today.getDate(); // Get day as a number (1-31)
  const month = today.getMonth() + 1; // Get month as a number (0-11) + 1 so it becomes (1-12)

  // New Years and New Years Eve
  if ((month === 1 && day === 1) || (month === 12 && day === 31)) {
    return "🎉";
  }

  // Valentines Day
  if (month === 2 && day === 14) {
    return getRandom(["❤️", "🥰", "💌"]);
  }

  // Pi Day
  if (month === 3 && day === 14) {
    return "🥧";
  }

  // St. Patricks Day
  if (month === 3 && day === 17) {
    return "🍀";
  }

  // Independence Day
  if (month === 7 && day === 4) {
    return getRandom(["🇺🇸", "🎆"]);
  }

  // Thanksgiving
  if (month === 11 && day > 20) {
    return "🦃";
  }

  // Halloween
  if (month === 10 && day === 31) {
    return getRandom(["🎃", "👻", "🕷️"]);
  }

  // Christmas and Chirtmas Eve
  if ((month === 12 && day === 25) || (month === 12 && day === 24))  {
    return getRandom(["🎄", "🎅", "🦌"]);
  }

  return "🚕";
}
