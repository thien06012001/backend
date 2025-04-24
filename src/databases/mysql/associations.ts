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

  // User to Event (participants) relationship
  UserModel.belongsToMany(EventModel, {
    through: EventParticipantModel,
    foreignKey: 'user_id',
    as: 'participatingEvents', // Match your interface
  });

  // Event to User (participants) relationship
  EventModel.belongsToMany(UserModel, {
    through: EventParticipantModel,
    foreignKey: 'event_id',
    as: 'participants',
  });

  // User to Invitation relationship
  UserModel.hasMany(InvitationModel, {
    foreignKey: 'user_id',
    as: 'invitations',
  });

  // Invitation to User relationship
  InvitationModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
  });

  // Event to Invitation relationship
  EventModel.hasMany(InvitationModel, {
    foreignKey: 'event_id',
    as: 'invitations',
  });

  // Invitation to Event relationship
  InvitationModel.belongsTo(EventModel, {
    foreignKey: 'event_id',
    as: 'event',
  });
};
