import { DB } from 'databases/mysql';
import { IPostRequest, Post } from 'interfaces/post.interface';

export const postRepo = {
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

  getByEventId: async (eventId: string): Promise<Post[]> => {
    await DB.sequelize.sync();
    return await DB.Posts.findAll({
      where: { eventId: eventId },
      include: [
        {
          model: DB.Comments,
          as: 'comments',
          include: [{ model: DB.Users, as: 'user' }],
        },
      ],
    });
  },

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

  create: async (post: IPostRequest): Promise<Post> => {
    await DB.sequelize.sync();
    return await DB.Posts.create({ ...post });
  },

  update: async (
    postId: string,
    post: Partial<IPostRequest>,
  ): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Posts.update(post, { where: { id: postId } });
  },

  delete: async (postId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Posts.destroy({ where: { id: postId } });
  },
};
