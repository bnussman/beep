import { eq, or } from "drizzle-orm";
import { beep } from "../../drizzle/schema";

export const inProgressBeep = or(
  eq(beep.status, "waiting"),
  eq(beep.status, "accepted"),
  eq(beep.status, "here"),
  eq(beep.status, "in_progress"),
  eq(beep.status, "on_the_way"),
);