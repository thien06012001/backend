import { IUserRequest } from 'interfaces/user.interface';
import { createUser, getUserByEmail } from 'modules/user/user.service';
import { CustomError } from 'utils/error.custom';
import { hash, compare } from 'bcrypt';

const secretKey = `${process.env.SECRET_KEY}`;

// Encrypt a string using XOR logic + base64 (used for session token)
export const encrypt = (text: string): string => {
  let result = '';

  // Loop through each character in the input text
  for (let i = 0; i < text.length; i++) {
    // Get the character code of the current character in the text
    const t = text.charCodeAt(i);

    // Get the character code of the corresponding character in the secret key
    // Use modulo to wrap around the key if the text is longer than the key
    const k = secretKey.charCodeAt(i % secretKey.length);

    // Perform XOR operation between the text character and key character
    // This obfuscates the character
    result += String.fromCharCode(t ^ k);
  }

  // Convert the resulting XORed string into a base64-encoded string
  return Buffer.from(result).toString('base64');
};

// Register a new user
export const register = async (req: IUserRequest) => {
  const { email, name, password, phone } = req;

  // Check if user already exists
  const isUserExist = await getUserByEmail(email);
  if (isUserExist) {
    throw new CustomError('User already exists', 409);
  }

  // Hash password before storing
  const hashedPassword = await hash(password, 12);

  // Create and return the new user
  return await createUser({
    email,
    name,
    password: hashedPassword,
    phone,
  });
};

// Login a user and return encrypted session token
export const login = async (req: Partial<IUserRequest>) => {
  const { email, password } = req;

  // Ensure email and password are provided
  if (!email || !password) {
    throw new CustomError('Email and password are required', 400);
  }

  // Fetch user by email
  const user = await getUserByEmail(email);
  if (!user) {
    throw new CustomError('Invalid email or password', 401);
  }

  // Validate password
  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    throw new CustomError('Invalid email or password', 401);
  }

  // Create session payload and encrypt it as token
  const sessionPayload = JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const token = encrypt(sessionPayload);

  return {
    token,
  };
};
