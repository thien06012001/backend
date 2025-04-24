export const setupAssociations = (models: {
  UserModel: any;
  EventModel: any;
  EventParticipantModel: any;
  InvitationModel: any;
}) => {
  const { UserModel, EventModel, EventParticipantModel, InvitationModel } =
    models;

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

  // User to Event (invitations) relationship - through Invitation
  UserModel.belongsToMany(EventModel, {
    through: InvitationModel,
    foreignKey: 'user_id',
    otherKey: 'event_id',
    as: 'invitedEvents',
  });

  // Event to User (invitations) relationship - through Invitation
  EventModel.belongsToMany(UserModel, {
    through: InvitationModel,
    foreignKey: 'event_id',
    otherKey: 'user_id',
    as: 'invitedUsers',
  });

  // Direct access to the invitation model (the join table)
  InvitationModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
  });

  InvitationModel.belongsTo(EventModel, {
    foreignKey: 'event_id',
  });

  // For easier access to invitations from user/event
  UserModel.hasMany(InvitationModel, {
    foreignKey: 'user_id',
  });

  EventModel.hasMany(InvitationModel, {
    foreignKey: 'event_id',
  });
};
