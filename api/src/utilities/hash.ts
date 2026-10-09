export function sha256(value: string) {
  const hasher = new Bun.CryptoHasher("sha256");

  hasher.update(value);

  return hasher.digest("hex");
}