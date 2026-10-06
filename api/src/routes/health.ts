import { o } from "../middleware/orpc";
import { getDatabaseStatus, getRedisStatus } from "../logic/health";

export const healthRouter = {
  healthcheck: o
    .handler(async () => {
      return {
        uptime: process.uptime(),
        services: {
          redis: await getRedisStatus(),
          db: await getDatabaseStatus()
        }
      };
    })
};
