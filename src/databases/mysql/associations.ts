export const setupAssociations = (models: {
  UserModel: any;
  EventModel: any;
  EventParticipantModel: any;
  InvitationModel: any;
  PostModel: any;
  CommentModel: any;
  NotificationModel: any;
  RequestModel: any;
}) => {
  const {
    UserModel,
    EventModel,
    EventParticipantModel,
    InvitationModel,
    PostModel,
    CommentModel,
    NotificationModel,
    RequestModel,
  } = models;

  // A user can own many events
  UserModel.hasMany(EventModel, {
    foreignKey: 'owner_id',
    as: 'ownedEvents',
  });

  // An event is owned by a single user
  EventModel.belongsTo(UserModel, {
    foreignKey: 'owner_id',
    as: 'owner',
  });

  // A user can participate in many events
  UserModel.belongsToMany(EventModel, {
    through: EventParticipantModel,
    foreignKey: 'user_id',
    as: 'participatingEvents',
  });

  // An event can have many user participants
  EventModel.belongsToMany(UserModel, {
    through: EventParticipantModel,
    foreignKey: 'event_id',
    as: 'participants',
  });

  // Invitation belongs to a user
  InvitationModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // Invitation belongs to an event
  InvitationModel.belongsTo(EventModel, {
    foreignKey: 'event_id',
    as: 'event',
  });

  // A user can have many invitations
  UserModel.hasMany(InvitationModel, {
    foreignKey: 'user_id',
    as: 'invitations',
  });

  // An event can have many invitations
  EventModel.hasMany(InvitationModel, {
    foreignKey: 'event_id',
    as: 'invitations',
  });

  // An event can have many posts
  EventModel.hasMany(PostModel, {
    foreignKey: 'event_id',
    as: 'posts',
  });

  // A post belongs to an event
  PostModel.belongsTo(EventModel, {
    foreignKey: 'event_id',
    as: 'event',
  });

  // A user can author many posts
  UserModel.hasMany(PostModel, {
    foreignKey: 'user_id',
    as: 'posts',
  });

  // A post belongs to an author (user)
  PostModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'author',
  });

  // A post can have many comments
  PostModel.hasMany(CommentModel, {
    foreignKey: 'post_id',
    as: 'comments',
  });

  // A comment belongs to a post
  CommentModel.belongsTo(PostModel, {
    foreignKey: 'post_id',
    as: 'post',
  });

  // A user can write many comments
  UserModel.hasMany(CommentModel, {
    foreignKey: 'user_id',
    as: 'comments',
  });

  // A comment belongs to a user
  CommentModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // A user can receive many notifications
  UserModel.hasMany(NotificationModel, {
    foreignKey: 'user_id',
    as: 'notifications',
  });

  // A notification belongs to a user
  NotificationModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // A user can make many event join requests
  UserModel.hasMany(RequestModel, {
    foreignKey: 'user_id',
    as: 'requests',
  });

  // A request belongs to a user
  RequestModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // An event can receive many requests
  EventModel.hasMany(RequestModel, {
    foreignKey: 'event_id',
    as: 'requests',
  });

  // A request belongs to an event
  RequestModel.belongsTo(EventModel, {
    foreignKey: 'event_id',
    as: 'event',
  });
};
