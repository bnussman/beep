import { GOOGLE_API_KEYS, OSRM_SECRET } from '../utils/constants';
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
// import * as Sentry from '@sentry/node';

@ObjectType()
class Suggestion {
  @Field()
  public title!: string;
}

const keys: string[] = JSON.parse(GOOGLE_API_KEYS || '[]');

function getRandom<T>(data: T[]): T {
  return data[Math.floor(Math.random() * data.length)];
}

@Resolver()
export class DirectionsResolver {

  @Query(() => String)
  public async getETA(@Arg('start') start: string, @Arg('end') end: string): Promise<string> {
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

  @Query(() => [Suggestion])
  public async getLocationSuggestions(@Arg('location') location: string, @Arg('sessiontoken') sessiontoken: string): Promise<Suggestion[]> {
    return [];
    const result = await fetch(encodeURI(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&key=${getRandom(keys)}&sessiontoken=${sessiontoken}`));

    const data = await result.json();

    const output: Suggestion[] = [];

    for (const prediction of data.predictions) {
      output.push({ title: prediction.description });
    }

    return output;
  }
}
