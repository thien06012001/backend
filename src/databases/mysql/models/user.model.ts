import { User } from 'interfaces/user.interface';

import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type UserCreationAttributes = Optional<User, 'id'>;

export class UserModel
  extends Model<User, UserCreationAttributes>
  implements User
{
  public id!: string;
  public email!: string;
  public name!: string;
  public password!: string;
  public phone: string | undefined;
  public created_at: string | undefined;
  public updated_at: string | undefined;
  public role: string = 'user'; // Updated to match interface
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
        validate: {
          isEmail: true,
        },
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          max: 50,
          min: 2,
        },
      },
      role: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
        validate: {
          max: 50,
          min: 6,
        },
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

  return UserModel;
}
