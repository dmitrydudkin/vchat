import { makeExecutableSchema } from 'graphql-tools';

import { Resolvers } from './resolvers';

export const Schema = [`
  scalar Date

  type Group {
    id: Int!
    name: String
    users: [User]!
    messages: [Message]
  }

  type User {
    id: Int!
    uuid: String
    username: String
    messages: [Message]
    groups: [Group]
  }

  type Message {
    id: Int!
    to: Group!
    from: User!
    text: String!
    createdAt: Date!
  }

  type Query {
    user(uuid: String, id: Int): User
    users: [User]

    messages(groupId: Int, userId: Int): [Message]

    group(id: Int!): Group
  },

  type Mutation {
    createMessage(text: String!, userId: Int!, groupId: Int!): Message
    createUser(uuid: String!, username: String!, groupId: Int!): User
  }

  type Subscription {
    messageAdded(userId: Int, groupIds: [Int]): Message
    userCreated: User
  }


  schema {
    query: Query,
    mutation: Mutation,
    subscription: Subscription
  }
`];

export const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

export default executableSchema;
