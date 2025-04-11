import { IUserRequest } from 'interfaces/user.interface';

import { createUser, getUserByEmail } from 'modules/user/user.service';

import { CustomError } from 'utils/error.custom';

import { hash } from 'bcrypt';

export const register = async (req: IUserRequest) => {
  const { email, name, password, username, phone } = req;

  const isUserExist = await getUserByEmail(email);

  if (isUserExist) {
    throw new CustomError('User already exists', 409);
  }

  const hashedPassword = await hash(password, 12);

  return await createUser({
    email,
    name,
    password: hashedPassword,
    username,
    phone,
  });
};
