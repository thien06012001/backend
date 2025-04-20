import { IUserRequest } from 'interfaces/user.interface';

import { createUser, getUserByEmail } from 'modules/user/user.service';

import { CustomError } from 'utils/error.custom';

import { hash, compare } from 'bcrypt';

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

export const login = async (req: Partial<IUserRequest>) => {
  const { email, password } = req;

  if (!email || !password) {
    throw new CustomError('Email and password are required', 400);
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new CustomError('Invalid email or password', 401);
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new CustomError('Invalid email or password', 401);
  }

  return {
    id: user.id,
    email: user.email,
  };
};
