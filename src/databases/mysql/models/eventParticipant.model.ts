import { DataTypes, Model, Sequelize } from 'sequelize';

export class EventParticipantModel extends Model {
  public event_id!: string;
  public user_id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof EventParticipantModel {
  EventParticipantModel.init(
    {
      event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'events',
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      tableName: 'event_participant',
      sequelize,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  return EventParticipantModel;
}
