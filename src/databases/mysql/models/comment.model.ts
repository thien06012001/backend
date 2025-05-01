import { Comment } from 'interfaces/comment.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type CommentCreationAttributes = Optional<Comment, 'id'>;

export class CommentModel
  extends Model<Comment, CommentCreationAttributes>
  implements Comment
{
  public id!: string;
  public content!: string;
  public postId!: string;
  public userId!: string;
  public created_at: string | undefined;
  public updated_at: string | undefined;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof CommentModel {
  CommentModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      postId: {
        allowNull: false,
        type: DataTypes.UUID,
        field: 'post_id',
        references: {
          model: 'posts',
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
      tableName: 'comments',
      sequelize,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
    },
  );

  return CommentModel;
}
