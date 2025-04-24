import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Invitation, InvitationStatus } from 'interfaces/invitation.interface';

export type InvitationCreationAttributes = Optional<Invitation, 'id'>;

export class InvitationModel
  extends Model<Invitation, InvitationCreationAttributes>
  implements Invitation
{
  public id!: string;
  public event_id!: string;
  public user_id!: string;
  public status!: InvitationStatus;
  public message?: string;
  public created_at: string | undefined;
  public updated_at: string | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof InvitationModel {
  InvitationModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      event_id: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'events',
          key: 'id',
        },
      },
      user_id: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM(...Object.values(InvitationStatus)),
        defaultValue: InvitationStatus.PENDING,
      },
      message: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: 'invitations',
      sequelize,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    },
  );

  return InvitationModel;
}
