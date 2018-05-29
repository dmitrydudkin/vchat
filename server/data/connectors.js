import { _ } from 'lodash';
import faker from 'faker';
import Sequelize from 'sequelize';

// initialize database
const db = new Sequelize('vchat', null, null, {
  dialect: 'sqlite',
  storage: './vchat.sqlite',
  logging: false,
});

// define groups
const GroupModel = db.define('group', {
  name: { type: Sequelize.STRING },
});

// define messages
const MessageModel = db.define('message', {
  text: { type: Sequelize.STRING },
});

// define users
const UserModel = db.define('user', {
  username: { type: Sequelize.STRING },
  uuid: { type: Sequelize.STRING },
});

// users belong to multiple groups
UserModel.belongsToMany(GroupModel, { through: 'GroupUser' });

// messages are sent from users
MessageModel.belongsTo(UserModel);

// messages are sent to groups
MessageModel.belongsTo(GroupModel);

// groups have multiple users
GroupModel.belongsToMany(UserModel, { through: 'GroupUser' });

// fake starter data
const GROUPS = 1;
const USERS_PER_GROUP = 2;
const MESSAGES_PER_USER = 1;
faker.seed(1234); // allwayes get consistent data

db.sync({ force: true }).then(() => _.times(GROUPS, () => GroupModel.create({
  name: `Чат "${faker.lorem.words(1).toUpperCase()}"`,
}).then(group => _.times(USERS_PER_GROUP, () => { //eslint-disable-line
  return group.createUser({
    username: faker.internet.userName(),
    uuid: faker.random.uuid(),
  }).then((user) => {
    console.log(user.uuid, user.username);

    _.times(MESSAGES_PER_USER, () => MessageModel.create({
      userId: user.id,
      groupId: group.id,
      text: `Привет, я ${user.username}`,
    }));

    return user;
  });
}))));

const Group = db.models.group;
const Message = db.models.message;
const User = db.models.user;

export { Group, Message, User };
