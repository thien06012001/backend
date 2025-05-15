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

  // User to Event (owner) relationship
  UserModel.hasMany(EventModel, {
    foreignKey: 'owner_id',
    as: 'ownedEvents',
  });

  // Event to User (owner) relationship
  EventModel.belongsTo(UserModel, {
    foreignKey: 'owner_id',
    as: 'owner',
  });

  // User to Event (participants) relationship - through EventParticipant
  UserModel.belongsToMany(EventModel, {
    through: EventParticipantModel,
    foreignKey: 'user_id',
    as: 'participatingEvents',
  });

  // Event to User (participants) relationship - through EventParticipant
  EventModel.belongsToMany(UserModel, {
    through: EventParticipantModel,
    foreignKey: 'event_id',
    as: 'participants',
  });

  // // User to Event (invitations) relationship - through Invitation
  // UserModel.belongsToMany(EventModel, {
  //   through: InvitationModel,
  //   foreignKey: 'user_id',
  //   otherKey: 'event_id',
  //   as: 'invitedEvents',
  // });

  // // Event to User (invitations) relationship - through Invitation
  // EventModel.belongsToMany(UserModel, {
  //   through: InvitationModel,
  //   foreignKey: 'event_id',
  //   otherKey: 'user_id',
  //   as: 'invitedUsers',
  // });

  // Direct access to the invitation model (the join table)
  InvitationModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  InvitationModel.belongsTo(EventModel, {
    foreignKey: 'event_id',
    as: 'event',
  });

  // For easier access to invitations from user/event
  UserModel.hasMany(InvitationModel, {
    foreignKey: 'user_id',
    as: 'invitations',
  });

  EventModel.hasMany(InvitationModel, {
    foreignKey: 'event_id',
    as: 'invitations',
  });

  // Post relationships
  EventModel.hasMany(PostModel, {
    foreignKey: 'event_id',
    as: 'posts',
  });

  PostModel.belongsTo(EventModel, {
    foreignKey: 'event_id',
    as: 'event',
  });

  UserModel.hasMany(PostModel, {
    foreignKey: 'user_id',
    as: 'posts',
  });

  // Post belongs to User
  PostModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'author',
  });

  // Comment relationships
  PostModel.hasMany(CommentModel, {
    foreignKey: 'post_id',
    as: 'comments',
  });

  CommentModel.belongsTo(PostModel, {
    foreignKey: 'post_id',
    as: 'post',
  });

  UserModel.hasMany(CommentModel, {
    foreignKey: 'user_id',
    as: 'comments',
  });

  CommentModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // Notification relationships
  UserModel.hasMany(NotificationModel, {
    foreignKey: 'user_id',
    as: 'notifications',
  });

  NotificationModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  UserModel.hasMany(RequestModel, {
    foreignKey: 'user_id',
    as: 'requests',
  });

  RequestModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  EventModel.hasMany(RequestModel, {
    foreignKey: 'event_id',
    as: 'requests',
  });

  RequestModel.belongsTo(EventModel, {
    foreignKey: 'event_id',
    as: 'event',
  });
};
