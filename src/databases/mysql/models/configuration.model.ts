import { Configuration } from 'interfaces/configuration.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type ConfigurationCreationAttributes = Optional<
  Configuration,
  'maxActiveEvents' | 'maxEventCapacity'
>;

export class ConfigurationModel
  extends Model<Configuration, ConfigurationCreationAttributes>
  implements Configuration
{
  public maxActiveEvents!: number;
  public maxEventCapacity!: number;
  public defaultParticipantReminder!: number;
  public defaultInvitationReminder!: number;
  public id!: string;
}

export default function (sequelize: Sequelize): typeof ConfigurationModel {
  ConfigurationModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      maxActiveEvents: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'max_active_events',
      },
      maxEventCapacity: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'max_event_capacity',
      },
      defaultParticipantReminder: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'default_participant_reminder',
      },
      defaultInvitationReminder: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'default_invitation_reminder',
      },
    },
    {
      tableName: 'configurations',
      sequelize,
    },
  );

  return ConfigurationModel;
}
