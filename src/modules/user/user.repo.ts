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
    return await DB.Users.create({ ...user, role: user.role ?? 'defaultRole' });
  },

  update: async (userId: string, user: IUserRequest): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Users.update(user, { where: { id: userId } });
  },

  delete: async (userId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Users.destroy({ where: { id: userId } });
  },
};
