import { OSRM_SECRET } from '../utils/constants';
import { Arg, Authorized, Query, Resolver } from "type-graphql";

@Resolver()
export class DirectionsResolver {

  @Query(() => String)
  @Authorized()
  public async getETA(@Arg('start', () => String) start: string, @Arg('end', () => String) end: string): Promise<string> {
    const username = "Admin";
    const password = OSRM_SECRET;

    // http://192.168.1.104:5000/route/v1/driving/-81.6538314,36.2221064;-80.75991097845207,35.08197829130579

    const result = await fetch(`https://osrm.ridebeep.app/route/v1/driving/${start};${end}`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64')
      }
    });

    // @todo add types for this API call
    const data = await result.json();

    // this is the ETA in seconds
    const eta = data?.routes?.[0]?.duration as number | undefined;

    if (!eta) {
      // Sentry.captureMessage("ETA from https://osrm.ridebeep.app was undefined");
      throw new Error("ETA Unavailable");
    }

    const etaMinutes = Math.round(eta / 60);

    return `${etaMinutes} min`;
  }
}
