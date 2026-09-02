import { o } from "../../utils/orpc";
import { getDatabaseStatus, getRedisStatus } from "./logic";

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
