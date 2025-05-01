import { DB } from 'databases/mysql';
import { Comment, ICommentRequest } from 'interfaces/comment.interface';

export const commentRepo = {
  getById: async (commentId: string): Promise<Comment | null> => {
    await DB.sequelize.sync();
    return await DB.Comments.findOne({
      where: { id: commentId },
      include: [
        { model: DB.Posts, as: 'post' },
        { model: DB.Users, as: 'user' },
      ],
    });
  },

  getByPostId: async (postId: string): Promise<Comment[]> => {
    await DB.sequelize.sync();
    return await DB.Comments.findAll({
      where: { postId },
      include: [{ model: DB.Users, as: 'user' }],
      order: [['created_at', 'ASC']],
    });
  },

  getByUserId: async (userId: string): Promise<Comment[]> => {
    await DB.sequelize.sync();
    return await DB.Comments.findAll({
      where: { userId },
      include: [{ model: DB.Posts, as: 'post' }],
    });
  },

  create: async (comment: ICommentRequest): Promise<Comment> => {
    await DB.sequelize.sync();
    return await DB.Comments.create({ ...comment });
  },

  update: async (
    commentId: string,
    comment: Partial<ICommentRequest>,
  ): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Comments.update(comment, { where: { id: commentId } });
  },

  delete: async (commentId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Comments.destroy({ where: { id: commentId } });
  },
};
