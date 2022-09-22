import { Report } from '../entities/Report';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { User, UserRole } from '../entities/User';
import { Arg, Args, Authorized, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Context } from '../utils/context';
import { ReportInput, UpdateReportInput } from './args';
import { PaginationArgs } from '../args/Pagination';
import { Paginated } from '../utils/paginated';

@ObjectType()
class ReportsResponse extends Paginated(Report) { }

@Resolver(Report)
export class ReportsResolver {

  @Mutation(() => Boolean)
  @Authorized()
  public async reportUser(@Ctx() ctx: Context, @Arg('input') input: ReportInput): Promise<boolean> {
    const user = ctx.em.getReference(User, input.userId);

    const report = new Report(ctx.user, user, input.reason, input.beepId);

    await ctx.em.persistAndFlush(report);

    return true;
  }

  @Query(() => ReportsResponse)
  @Authorized(UserRole.ADMIN)
  public async getReports(@Ctx() ctx: Context, @Args() { offset, show }: PaginationArgs, @Arg('id', { nullable: true }) id?: string): Promise<ReportsResponse> {
    const [reports, count] = await ctx.em.findAndCount(Report, {}, {
      orderBy: { timestamp: QueryOrder.DESC },
      limit: show,
      offset: offset,
      populate: ['reported', 'reporter'],
      filters: id ? { in: { id } } : undefined
    });

    return {
      items: reports,
      count: count
    }
  }

  @Mutation(() => Report)
  @Authorized(UserRole.ADMIN)
  public async updateReport(@Ctx() ctx: Context, @Arg("id") id: string, @Arg('input') input: UpdateReportInput): Promise<Report> {
    const report = await ctx.em.findOneOrFail(Report, id, { populate: ['reporter', 'reported', 'handledBy'] });

    if (input.handled) {
      report.handledBy = ctx.user;
    }
    else {
      report.handledBy = null;
    }

    wrap(report).assign(input);

    await ctx.em.persistAndFlush(report);

    return report;
  }

  @Query(() => Report)
  @Authorized(UserRole.ADMIN)
  public async getReport(@Ctx() ctx: Context, @Arg('id') id: string): Promise<Report> {
    return await ctx.em.findOneOrFail(Report, id, { populate: ['reporter', 'reported', 'beep', 'handledBy'] });
  }

  @Mutation(() => Boolean)
  @Authorized(UserRole.ADMIN)
  public async deleteReport(@Ctx() ctx: Context, @Arg('id') id: string): Promise<boolean> {
    const report = ctx.em.getReference(Report, id);

    await ctx.em.removeAndFlush(report);

    return true;
  }
}