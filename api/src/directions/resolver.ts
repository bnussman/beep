import { GOOGLE_API_KEYS } from '../utils/constants';
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import * as Sentry from '@sentry/node';

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
    const result = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=${getRandom(keys)}`);

    const data = await result.json();

    const eta = data?.routes?.[0]?.legs?.[0]?.duration?.text;

    if (!eta) {
      Sentry.captureMessage("ETA from Google Maps API was undefined");
      throw new Error("ETA Unavailable");
    }

    return eta;
  }

  @Query(() => [Suggestion])
  public async getLocationSuggestions(@Arg('location') location: string, @Arg('sessiontoken') sessiontoken: string): Promise<Suggestion[]> {
    const result = await fetch(encodeURI(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&key=${getRandom(keys)}&sessiontoken=${sessiontoken}`));

    const data = await result.json();

    const output: Suggestion[] = [];

    for (const prediction of data.predictions) {
      output.push({ title: prediction.description });
    }

    return output;
  }
}
