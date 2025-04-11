import { IBase } from './base.interface';
import { Event } from './event.interface';

export interface IUserRequest {
  email: string;
  name: string;
  username: string;
  password: string;
  phone?: string;
}

export interface User extends IBase, IUserRequest {
  ownedEvents?: Event[]; // Events this user owns
  participatingEvents?: Event[]; // Events this user participates in
}
