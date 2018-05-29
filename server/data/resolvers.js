import GraphQLDate from 'graphql-date';

import { Group, Message, User } from './connectors';
import { pubsub } from '../subscriptions';

const MESSAGE_ADDED = 'messageAdded';
const USER_CREATED = 'userCreated';

export const Resolvers = {
  Date: GraphQLDate,
  Query: {
    group(_, args) {
      return Group.find({ where: args });
    },
    messages(_, args) {
      return Message.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
    },
    user(_, args) {
      return User.findOne({ where: args });
    },
    users(_, args) {
      return User.findAll({ where: args });
    },
  },
  Mutation: {
    createMessage(_, { text, userId, groupId }) {
      return Message.create({
        userId,
        text,
        groupId,
      }).then((message) => {
        pubsub.publish(MESSAGE_ADDED, { [MESSAGE_ADDED]: message });
        return message;
      });
    },
    createUser(_, { uuid, username, groupId }) {
      return Group.findOne({ where: { id: groupId } })
        .then(group => group.createUser({
          uuid,
          username,
        })).then((user) => {
          pubsub.publish(USER_CREATED, { [USER_CREATED]: user });
          return user;
        });
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_ADDED),
    },
    userCreated: {
      subscribe: () => pubsub.asyncIterator(USER_CREATED),
    },
  },
  Group: {
    users(group) {
      return group.getUsers();
    },
    messages(group) {
      return Message.findAll({
        where: { groupId: group.id },
        order: [['createdAt', 'DESC']],
      });
    },
  },
  Message: {
    to(message) {
      return message.getGroup();
    },
    from(message) {
      return message.getUser();
    },
  },
  User: {
    messages(user) {
      return Message.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });
    },
    groups(user) {
      return user.getGroups();
    },
  },
};

export default Resolvers;
