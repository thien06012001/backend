import { DB } from 'databases/mysql';
import { IUserRequest, User } from 'interfaces/user.interface';

// Repository object containing user-related DB operations
export const repo = {
  // Get a single user by their ID
  getById: async (userId: string | undefined): Promise<User | null> => {
    await DB.sequelize.sync();
    return await DB.Users.findOne({ where: { id: userId } });
  },

  // Get a single user by email
  getByEmail: async (email: string): Promise<User | null> => {
    await DB.sequelize.sync();
    return await DB.Users.findOne({ where: { email } });
  },

  // Get all users
  getAll: async (): Promise<User[]> => {
    await DB.sequelize.sync();
    return await DB.Users.findAll();
  },

  // Create a new user with default role as 'user'
  create: async (user: IUserRequest): Promise<User> => {
    await DB.sequelize.sync();
    return await DB.Users.create({ ...user, role: 'user' });
  },

  // Update an existing user by ID
  update: async (userId: string, user: IUserRequest): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Users.update(user, { where: { id: userId } });
  },

  // Delete a user by ID
  delete: async (userId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Users.destroy({ where: { id: userId } });
  },

  // Get events created by a specific user
  getEventsByUserId: async (userId: string): Promise<any> => {
    await DB.sequelize.sync();

    const user = await DB.Users.findOne({
      where: { id: userId },
      include: [
        {
          model: DB.Events,
          as: 'ownedEvents',
          attributes: ['id', 'name', 'start_time', 'is_public'],
        },
      ],
    });

    return user;
  },

  // Get events the user has joined as a participant
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
              attributes: ['id'],
            },
          ],
          attributes: ['id', 'name', 'capacity', 'is_public', 'start_time'],
        },
      ],
    });

    return user;
  },
};
