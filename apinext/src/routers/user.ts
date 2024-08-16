import { observable } from "@trpc/server/observable";
import { authedProcedure, router } from "../utils/trpc";
import { user } from '../../drizzle/schema';
import { redis } from "../utils/redis";
import { db } from "../utils/db";
import { eq } from "drizzle-orm";


export const userRouter = router({
})
