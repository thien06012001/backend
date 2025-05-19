import { DB } from 'databases/mysql';
import { IPostRequest, Post } from 'interfaces/post.interface';

export const postRepo = {
  // Get a single post by ID, including its related event and comments (with comment users)
  getById: async (postId: string): Promise<Post | null> => {
    await DB.sequelize.sync();
    return await DB.Posts.findOne({
      where: { id: postId },
      include: [
        { model: DB.Events, as: 'event' },
        {
          model: DB.Comments,
          as: 'comments',
          include: [{ model: DB.Users, as: 'user' }],
        },
      ],
    });
  },

  // Get all posts for a specific event, including comments and commenter info
  getByEventId: async (eventId: string): Promise<Post[]> => {
    await DB.sequelize.sync();
    return await DB.Posts.findAll({
      where: { eventId },
      include: [
        {
          model: DB.Comments,
          as: 'comments',
          include: [{ model: DB.Users, as: 'user' }],
        },
      ],
    });
  },

  // Get all posts in the system, including related events and nested comments
  getAll: async (): Promise<Post[]> => {
    await DB.sequelize.sync();
    return await DB.Posts.findAll({
      include: [
        { model: DB.Events, as: 'event' },
        {
          model: DB.Comments,
          as: 'comments',
          include: [{ model: DB.Users, as: 'user' }],
        },
      ],
    });
  },

  // Create a new post
  create: async (post: IPostRequest): Promise<Post> => {
    await DB.sequelize.sync();
    return await DB.Posts.create({ ...post });
  },

  // Update an existing post by ID, partially updating only provided fields
  update: async (
    postId: string,
    post: Partial<IPostRequest>,
  ): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Posts.update(post, { where: { id: postId } });
  },

  // Delete a post by ID
  delete: async (postId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Posts.destroy({ where: { id: postId } });
  },
};
