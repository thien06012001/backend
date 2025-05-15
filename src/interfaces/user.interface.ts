import { IBase } from './base.interface';
import { Event } from './event.interface';
import { Invitation } from './invitation.interface';
import { Request } from './request.interface';

export interface IUserRequest {
  email: string;
  name: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface User extends IBase, IUserRequest {
  ownedEvents?: Event[]; // Events this user owns
  participatingEvents?: Event[]; // Events this user participates in
  invitedEvents?: Event[]; // Events this user is invited to
  invitations?: Invitation[]; // Direct access to invitations
  role?: string;
  requests?: Request[];
}
