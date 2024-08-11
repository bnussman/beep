import { authedProcedure, router } from "../trpc";

export const userRouter = router({
  me: authedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  })
})
