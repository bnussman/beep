import z from "zod";
import { DEFAULT_PAGE_SIZE } from "./constants";

export function getPagesFromCount(count: number, pageSize: number): number {
  return Math.ceil(count / pageSize);
}

export function getOffsetFromPage(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

export const paginationSchema = z.object({
  page: z.int().min(1).default(1),
  pageSize: z.int().min(1).max(500).default(DEFAULT_PAGE_SIZE),
});