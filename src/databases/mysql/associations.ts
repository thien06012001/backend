export function setupAssociations(models: {
  UserModel: any;
  EventModel: any;
  EventParticipantModel: any;
}) {
  const { UserModel, EventModel } = models;

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
    through: 'event_participant',
    foreignKey: 'user_id',
    as: 'participatingEvents', // Match your interface
  });

  // Event to User (participants) relationship
  EventModel.belongsToMany(UserModel, {
    through: 'event_participant',
    foreignKey: 'event_id',
    as: 'participants',
  });
}
