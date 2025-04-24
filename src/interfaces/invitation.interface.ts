import { IBase } from './base.interface';
import { Event } from './event.interface';
import { User } from './user.interface';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface IInvitationRequest {
  event_id: string;
  user_id: string;
  status?: InvitationStatus;
}

export interface Invitation extends IBase, IInvitationRequest {
  event?: Event;
  user?: User;
  status: InvitationStatus;
}
