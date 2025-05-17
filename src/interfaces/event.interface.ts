import { IBase } from './base.interface';
import { User } from './user.interface';
import { Invitation } from './invitation.interface';
import { Request } from './request.interface';

export interface IEventRequest {
  name: string;
  start_time: string;
  end_time: string;
  owner_id: string;
  is_public: boolean; // Default value is true
  location: string;
  capacity: number;
  description: string;
  image_url: string;
}

export interface Event extends IBase, IEventRequest {
  owner?: User; // The owner of this event
  participants?: User[]; // Users participating in this event
  invitedUsers?: User[]; // Users invited to this event
  invitations?: Invitation[]; // Direct access to invitations
  requests?: Request[];
  participantReminder?: number;
  invitationReminder: number;
}
