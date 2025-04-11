import { User } from 'interfaces/user.interface';

import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

import { EventModel } from './event.model';

export type UserCreationAttributes = Optional<User, 'id' | 'username'>;

export class UserModel
  extends Model<User, UserCreationAttributes>
  implements User
{
  public id!: string;
  public email!: string;
  public name!: string;
  public username!: string;
  public password!: string;
  public phone: string | undefined;
  public created_at: string | undefined;
  public updated_at: string | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      username: {
        allowNull: true,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      phone: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      tableName: 'users',
      sequelize,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    },
  );

  UserModel.hasMany(EventModel, {
    foreignKey: 'owner_id',
    as: 'ownedEvents',
  });

  // Participating events (many-to-many)
  UserModel.belongsToMany(EventModel, {
    through: 'event_participants',
    foreignKey: 'user_id',
    as: 'participatingEvents',
  });

  return UserModel;
}
