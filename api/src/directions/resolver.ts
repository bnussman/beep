import fetch from 'node-fetch';
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class DirectionsResolver {

    @Query(() => String)
    public async getETA(@Arg('start') start: string, @Arg('end') end: string): Promise<string> {
        const result = await fetch('https://maps.googleapis.com/maps/api/directions/json?origin=' + start + '&destination=' + end + '&key=AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI');

        const data = await result.json();

        return data.routes[0].legs[0].duration.text;
    }
}
