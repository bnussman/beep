import { UserRole } from "../entities/User";
import { AuthChecker, MiddlewareFn } from "type-graphql";
import { Context } from "../utils/context";
import { AuthenticationError } from "apollo-server-core";
import { QueueEntry } from "../entities/QueueEntry";
import { nextTick } from "process";
import { pubSub } from "../";
import { QueryOrder } from "@mikro-orm/core";
import fieldsToRelations from "graphql-fields-to-relations";

const check: AuthChecker<Context> = ({ context, args }, roles) => {
  const { user } = context;

  if (!user) return false;

  // Let admins do anything
  if (user.role === UserRole.ADMIN) return true;

  if (roles[0] === 'No Verification') return true;

  if (roles[0] === 'No Verification Self') return args.id === undefined || args.id === user.id;

  if (!user.isEmailVerified) throw new AuthenticationError("Please verify your email to use the Beep App");

  if (roles.length === 0) return true;

  if (roles[0] === 'self') {
    return args.id === undefined || args.id === user.id;
  }

  if (roles[0] == context.user.role) {
    return true;
  }

  return false;
};

export const authChecker: AuthChecker<Context> = (resolverData, roles) => {
  const allow = check(resolverData, roles);

  if (allow && resolverData.info.operation.operation === 'subscription' && !resolverData.info.rootValue) {
    nextTick(async () => {
      if (resolverData.info.fieldName === 'getUserUpdates') {
        console.log(resolverData.context.user)
        pubSub.publish("User" + resolverData.context.user.id, resolverData.context.token.user);
      }
      if (resolverData.info.fieldName === 'getBeeperUpdates') {
        const populate = fieldsToRelations(resolverData.info) as Array<keyof QueueEntry>;

        const queue = await resolverData.context.em.find(QueueEntry, { beeper: resolverData.args?.id || resolverData.context.user.id }, { orderBy: { start: QueryOrder.ASC }, populate });

        pubSub.publish("Beeper" + resolverData.args.id, queue);
      }
      if (resolverData.info.fieldName === 'getRiderUpdates') {
        const entry = await resolverData.context.em.findOne(QueueEntry, { rider: resolverData.context.user.id }, { populate: ['beeper', 'beeper.queue'] });

        if (!entry) {
          return null;
        }
    
        entry.position = entry.beeper.queue.getItems().filter((_entry: QueueEntry) => _entry.start < entry.start && _entry.state > 0).length;
    
        pubSub.publish("Rider" + resolverData.context.user.id, entry);
      }
    });
  }

  return allow;
};

export const LeakChecker: MiddlewareFn<Context> = async ({ context, info }, next) => {
  const result = await next();

  // console.log("--------------------------------------");
  // console.log(result, info);
  // console.log("--------------------------------------");

  if (!context?.user) {
    return result;
  }

  if (context.user.role === UserRole.ADMIN) {
    return result;
  }

  //@ts-expect-error ill fix later
  if (["email", "phone", "location"].includes(info.fieldName) && context.user[info.fieldName] !== result) {
    // a protectd value is trying to used
    const entry = await context.em.findOne(QueueEntry, { state: { $gt: 0 }, $or: [ { rider: context.user.id }, { beeper: context.user.id} ] });

    const hasAcceptedEntry = entry !== null && entry !== undefined;

    if (hasAcceptedEntry) {
      return result;
    } else {
      console.log(`returning null because queue is not accepted | trying to get ${info.fieldName} | ${context.user.name()}`)
      return null;
    }
  }

  return result;
};