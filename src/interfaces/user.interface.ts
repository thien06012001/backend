import { IBase } from './base.interface';
export interface IUserRequest {
  email: string;
  name: string;
  username: string;
  password: string;
}

export interface User extends IBase, IUserRequest {}
