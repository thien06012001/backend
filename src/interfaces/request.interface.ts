import { IBase } from './base.interface';
import { Event } from './event.interface';
import { Comment } from './comment.interface';
import { User } from './user.interface';

export interface IRequest {
  eventId: string;
  userId: string;
  status: string;
}

export interface Request extends IBase, IRequest {
  event?: Event;
  user?: User;
}
