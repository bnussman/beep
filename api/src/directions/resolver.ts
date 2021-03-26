import fetch from 'node-fetch';
import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
class Suggestion {
    @Field()
    public title!: string;
}

@Resolver()
export class DirectionsResolver {

    @Query(() => String)
    public async getETA(@Arg('start') start: string, @Arg('end') end: string): Promise<string> {
        const result = await fetch('https://maps.googleapis.com/maps/api/directions/json?origin=' + start + '&destination=' + end + '&key=AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI');

        const data = await result.json();

        return data.routes[0].legs[0].duration.text;
    }

    @Query(() => [Suggestion])
    public async getLocationSuggestions(@Arg('location') location: string): Promise<Suggestion[]> {
        const result = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&key=AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI&sessiontoken=1234567890`);

        const data = await result.json();

        const output: Suggestion[] = [];

        for (const prediction of data.predictions) {
            output.push({ title: prediction.description });
        }

        console.log(output);

        return output;
    }
}
