import { IBase } from './base.interface';
import { Event } from './event.interface';
import { Comment } from './comment.interface';

export interface IPostRequest {
  title: string;
  content: string;
  eventId: string;
}

export interface Post extends IBase, IPostRequest {
  event?: Event; // The event this post belongs to
  comments?: Comment[]; // Comments on this post
}
