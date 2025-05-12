import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Notification } from 'interfaces/notification.interface';

export type NotificationCreationAttributes = Optional<Notification, 'id'>;

export class NotificationModel
  extends Model<Notification, NotificationCreationAttributes>
  implements Notification
{
  public id!: string;
  public userId!: string;
  public title!: string;
  public description!: string;
  public isRead!: boolean;
  public created_at: string | undefined;
  public updated_at: string | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof NotificationModel {
  NotificationModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      isRead: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read',
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: 'notifications',
      sequelize,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    },
  );

  return NotificationModel;
}
