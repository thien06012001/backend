import { Event } from 'interfaces/event.interface';

import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

import { UserModel } from './user.model';

export type EvenCreationAttributes = Optional<Event, 'id' | 'name'>;

export class EventModel
  extends Model<Event, EvenCreationAttributes>
  implements Event
{
  public id!: string;
  public name!: string;
  public start_time!: string;
  public end_time!: string;
  public owner_id!: string;
  public created_at: string | undefined;
  public updated_at: string | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof EventModel {
  EventModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      start_time: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      end_time: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      owner_id: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: 'events',
      sequelize,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  // Owner relationship (one-to-many)
  EventModel.belongsTo(UserModel, {
    foreignKey: 'owner_id',
    as: 'owner',
  });

  // Participants relationship (many-to-many)
  EventModel.belongsToMany(UserModel, {
    through: 'event_participants',
    foreignKey: 'event_id',
    as: 'participants',
  });

  return EventModel;
}
