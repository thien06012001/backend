import { DB } from 'databases/mysql';

import { IUserRequest, User } from 'interfaces/user.interface';

export const repo = {
  getById: async (userId: string | undefined): Promise<User | null> => {
    await DB.sequelize.sync();
    return await DB.Users.findOne({ where: { id: userId } });
  },

  getByEmail: async (email: string): Promise<User | null> => {
    await DB.sequelize.sync();
    return await DB.Users.findOne({ where: { email } });
  },

  getAll: async (): Promise<User[]> => {
    await DB.sequelize.sync();
    return await DB.Users.findAll();
  },

  create: async (user: IUserRequest): Promise<User> => {
    await DB.sequelize.sync();
    return await DB.Users.create({ ...user, role: 'user' });
  },

  update: async (userId: string, user: IUserRequest): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Users.update(user, { where: { id: userId } });
  },

  delete: async (userId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Users.destroy({ where: { id: userId } });
  },
  getEventsByUserId: async (userId: string): Promise<any> => {
    await DB.sequelize.sync();

    const user = await DB.Users.findOne({
      where: { id: userId },
      include: [{ model: DB.Events, as: 'ownedEvents' }],
    });

    return user;
  },
  getJoinedEventsByUserId: async (userId: string): Promise<any> => {
    await DB.sequelize.sync();

    const user = await DB.Users.findOne({
      where: { id: userId },
      include: [
        {
          model: DB.Events,
          as: 'participatingEvents',
          include: [
            {
              model: DB.Users,
              as: 'participants',
            },
          ],
        },
      ],
    });

    return user;
  },
};
