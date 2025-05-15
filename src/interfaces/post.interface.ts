import { IBase } from './base.interface';
import { Event } from './event.interface';
import { Comment } from './comment.interface';
import { User } from './user.interface';

export interface IPostRequest {
  title: string;
  content: string;
  eventId: string;
  userId: string;
}

export interface Post extends IBase, IPostRequest {
  event?: Event;
  comments?: Comment[];
  user?: User;
}
