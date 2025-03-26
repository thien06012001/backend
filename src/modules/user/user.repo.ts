import { DB } from 'databases/mysql';
import { User } from 'interfaces/user.interface';

export const repo = {
  getUserById: async (userId: string | undefined): Promise<User | null> => {
    return await DB.Users.findOne({ where: { id: userId } });
  },
  getAllUsers: async (): Promise<User[]> => {
    return await DB.Users.findAll();
  },
  createUser: async (user: User): Promise<User> => {
    return await DB.Users.create(user);
  },
  updateUser: async (userId: string, user: User): Promise<[number]> => {
    return await DB.Users.update(user, { where: { id: userId } });
  },
  deleteUser: async (userId: string): Promise<number> => {
    return await DB.Users.destroy({ where: { id: userId } });
  },
};
