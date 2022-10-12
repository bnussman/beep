import { Arg, Args, Authorized, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Context } from '../utils/context';
import { Car } from '../entities/Car';
import { Paginated, PaginationArgs } from '../utils/pagination';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { CarArgs, EditCarArgs } from './args';
import { s3 } from '../utils/s3';
import { FileUpload } from 'graphql-upload';
import { UserRole } from '../entities/User';
import { AuthenticationError } from 'apollo-server-core';

@ObjectType()
class CarsResponse extends Paginated(Car) {}

@Resolver(Car)
export class CarResolver {

  @Mutation(() => Car)
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
      default: true,
    }, { em: ctx.em });

    ctx.em.nativeUpdate(Car, { user: ctx.user.id }, { default: false });

    await ctx.em.persistAndFlush(car);

    return car;
  }

  @Query(() => CarsResponse)
  @Authorized('self')
  public async getCars(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs, @Arg('id', { nullable: true }) id?: string): Promise<CarsResponse> {
    if (!id && ctx.user.role !== UserRole.ADMIN) {
      throw new AuthenticationError("You cant do that");
    }

    const filter = id ? { user: id  } : {};

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

  @Mutation(() => Car)
  @Authorized()
  public async editCar(@Ctx() ctx: Context, @Arg("id") id: string, @Args() data: EditCarArgs): Promise<Car> {
    const car = await ctx.em.findOneOrFail(Car, id);

    if (ctx.user.role !== UserRole.ADMIN && car.user.id !== ctx.user.id) {
      throw new AuthenticationError("you can't do that"); 
    }
    
    ctx.em.nativeUpdate(Car, { user: ctx.user.id, id: { $ne: id } }, { default: false });

    wrap(car).assign(data);

    await ctx.em.persistAndFlush(car);

    return car;
  }

  @Mutation(() => Boolean)
  @Authorized('self')
  public async deleteCar(@Ctx() ctx: Context, @Arg("id") id: string): Promise<boolean> {
    const car = await ctx.em.findOneOrFail(Car, id);
    const count = await ctx.em.count(Car, { user: ctx.user.id });

    if (car.default && count > 1) {
      throw new Error("You must make another car default before you delete this one.");
    }

    await ctx.em.removeAndFlush(car);

    return true;
  }
}
