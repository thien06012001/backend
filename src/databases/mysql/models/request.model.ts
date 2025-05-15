import { Request } from 'interfaces/request.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type RequestCreationAttributes = Optional<Request, 'id'>;

export class RequestModel
  extends Model<Request, RequestCreationAttributes>
  implements Request
{
  public id!: string;
  public status!: string;
  public eventId!: string;
  public userId!: string; // NEW
  public created_at: string | undefined;
  public updated_at: string | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof RequestModel {
  RequestModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      status: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      eventId: {
        allowNull: false,
        type: DataTypes.UUID,
        field: 'event_id',
        references: {
          model: 'events',
          key: 'id',
        },
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
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: 'requests',
      sequelize,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    },
  );

  return RequestModel;
}
