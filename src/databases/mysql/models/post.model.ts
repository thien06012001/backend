import { Post } from 'interfaces/post.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type PostCreationAttributes = Optional<Post, 'id'>;

export class PostModel
  extends Model<Post, PostCreationAttributes>
  implements Post
{
  public id!: string;
  public title!: string;
  public content!: string;
  public eventId!: string;
  public userId!: string; // NEW
  public created_at: string | undefined;
  public updated_at: string | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof PostModel {
  PostModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      content: {
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
      tableName: 'posts',
      sequelize,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    },
  );

  return PostModel;
}
