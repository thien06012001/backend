import { DB } from 'databases/mysql';
import { IUserRequest, User } from 'interfaces/user.interface';

export const repo = {
  getById: async (userId: string | undefined): Promise<User | null> => {
    return await DB.Users.findOne({ where: { id: userId } });
  },
  getAll: async (): Promise<User[]> => {
    return await DB.Users.findAll();
  },
  create: async (user: IUserRequest): Promise<User> => {
    return await DB.Users.create(user);
  },
  update: async (userId: string, user: IUserRequest): Promise<[number]> => {
    return await DB.Users.update(user, { where: { id: userId } });
  },
  delete: async (userId: string): Promise<number> => {
    return await DB.Users.destroy({ where: { id: userId } });
  },
};
