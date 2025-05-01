import { IBase } from './base.interface';
import { Post } from './post.interface';
import { User } from './user.interface';

export interface ICommentRequest {
  content: string;
  postId: string;
  userId: string;
}

export interface Comment extends IBase, ICommentRequest {
  post?: Post; // The post this comment belongs to
  user?: User; // The user who made this comment
}
