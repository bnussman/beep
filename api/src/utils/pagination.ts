export function getPagesFromCount(count: number, pageSize: number): number {
  return Math.ceil(count / pageSize);
}

export function getOffsetFromPage(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}