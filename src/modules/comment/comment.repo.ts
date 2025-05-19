import { DB } from 'databases/mysql';
import { Comment, ICommentRequest } from 'interfaces/comment.interface';

export const commentRepo = {
  // Get a single comment by its ID, including its post and user info
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

  // Get all comments for a specific post, sorted by creation time
  getByPostId: async (postId: string): Promise<Comment[]> => {
    await DB.sequelize.sync();
    return await DB.Comments.findAll({
      where: { postId },
      include: [{ model: DB.Users, as: 'user' }],
      order: [['created_at', 'ASC']],
    });
  },

  // Get all comments made by a specific user, including related posts
  getByUserId: async (userId: string): Promise<Comment[]> => {
    await DB.sequelize.sync();
    return await DB.Comments.findAll({
      where: { userId },
      include: [{ model: DB.Posts, as: 'post' }],
    });
  },

  // Create a new comment
  create: async (comment: ICommentRequest): Promise<Comment> => {
    await DB.sequelize.sync();
    return await DB.Comments.create({ ...comment });
  },

  // Update an existing comment by ID
  update: async (
    commentId: string,
    comment: Partial<ICommentRequest>,
  ): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Comments.update(comment, { where: { id: commentId } });
  },

  // Delete a comment by ID
  delete: async (commentId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Comments.destroy({ where: { id: commentId } });
  },
};
