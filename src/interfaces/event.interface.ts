import { IBase } from './base.interface';

import { User } from './user.interface';

export interface IEventRequest {
  name: string;
  start_time: string;
  visibility: string; // 'public' or 'private'
  end_time: string;
  owner_id: string;
  is_public?: boolean; // Default value is true
}

export interface Event extends IBase, IEventRequest {
  owner?: User; // The owner of this event
  participants?: User[]; // Users participating in this event
}
