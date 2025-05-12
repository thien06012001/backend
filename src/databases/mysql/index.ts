import Sequelize from 'sequelize';

import userModel from './models/user.model';
import eventModel from './models/event.model';
import eventParticipantModel from './models/eventParticipant.model';
import invitationModel from './models/invitation.model';
import postModel from './models/post.model';
import commentModel from './models/comment.model';
import notificationModel from './models/notification.model';

import {
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  NODE_ENV,
} from 'config';
import logger from 'utils/logger';

import { setupAssociations } from './associations';

const sequelize = new Sequelize.Sequelize(
  DB_NAME as string,
  DB_USERNAME as string,
  DB_PASSWORD,
  {
    dialect: (DB_DIALECT as Sequelize.Dialect) || 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT as string, 10),
    timezone: '+09:00',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      underscored: true,
      freezeTableName: true,
    },
    pool: {
      min: 0,
      max: 5,
    },
    logQueryParameters: NODE_ENV === 'development',
    logging: (query, time) => {
      logger.info(time + 'ms' + ' ' + query);
    },
    benchmark: true,
  },
);

sequelize.authenticate();

// Initialize all models first
const UserModel = userModel(sequelize);
const EventModel = eventModel(sequelize);
const EventParticipantModel = eventParticipantModel(sequelize);
const InvitationModel = invitationModel(sequelize);
const PostModel = postModel(sequelize);
const CommentModel = commentModel(sequelize);
const NotificationModel = notificationModel(sequelize);

setupAssociations({
  UserModel,
  EventModel,
  EventParticipantModel,
  InvitationModel,
  PostModel,
  CommentModel,
  NotificationModel,
});

export const DB = {
  Users: UserModel,
  Events: EventModel,
  EventParticipants: EventParticipantModel,
  Invitations: InvitationModel,
  Posts: PostModel,
  Comments: CommentModel,
  Notifications: NotificationModel,
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};
