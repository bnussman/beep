import { getTableColumns } from "drizzle-orm";
import { user } from "../../drizzle/schema";

export function getUserColumns() {
  const { password, passwordType, ...userColumns } = getTableColumns(user);
  return userColumns;
}
