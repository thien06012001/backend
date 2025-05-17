import { Event } from 'interfaces/event.interface';

import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

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
  public location!: string;
  public capacity!: number;
  public created_at: string | undefined;
  public updated_at: string | undefined;
  public description!: string;
  public image_url!: string;
  public is_public!: boolean; // Default value
  public participantReminder!: number;
  public invitationReminder!: number;
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
      is_public: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      capacity: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      location: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      image_url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      participantReminder: {
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue: 2,
      },
      invitationReminder: {
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue: 2,
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

  return EventModel;
}
