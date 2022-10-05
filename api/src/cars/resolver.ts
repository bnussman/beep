import { Arg, Args, Authorized, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Context } from '../utils/context';
import { Car } from '../entities/Car';
import { Paginated, PaginationArgs } from '../utils/pagination';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { CarArgs } from './args';
import { s3 } from '../utils/s3';
import { FileUpload } from 'graphql-upload';

@ObjectType()
class CarsResponse extends Paginated(Car) {}

@Resolver(Car)
export class CarResolver {

  @Mutation(() => Boolean)
  @Authorized()
  public async createCar(@Ctx() ctx: Context, @Args() data: CarArgs): Promise<Car> {
    const { photo, ...input } = data;

    const { createReadStream, filename } = await (photo as unknown as Promise<FileUpload>);

    const extention = filename.substring(filename.lastIndexOf("."), filename.length);

    const car = new Car();

    const uploadParams = {
      Body: createReadStream(),
      Key: `cars/${car.id}${extention}`,
      Bucket: "beep",
      ACL: "public-read"
    };

    const upload = await s3.upload(uploadParams).promise();

    wrap(car).assign({
      ...input,
      user: ctx.user,
      photo: upload.Location,
    });

    return car;
  }

  @Query(() => CarsResponse)
  @Authorized()
  public async getCars(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs, @Arg('id', { nullable: true }) id?: string): Promise<CarsResponse> {
    const filter = id ? { user: id } : {};

    const [cars, count] = await ctx.em.findAndCount(Car, filter, {
      orderBy: { created: QueryOrder.DESC },
      populate: ['user'],
      offset: offset,
      limit: show,
    });

    return {
      items: cars,
      count: count
    };
  }
}
