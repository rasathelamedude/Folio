export type Post = {
  id: number;
  createdAt: Date;
  userId: number;
  bookId: number;
  content: string;
};

export type EditablePost = Partial<Pick<Post, "content" | "bookId">>;
export type ShareablePost = {
  content: string;
  book?: {
    bookId: number | null;
    googleBookId: string;
    title: string;
    description?: string;
    coverImageUrl?: string;
    authors?: string[];
  }
}

export type Like = {
  userId: number;
  postId: number | null;
  commentId: number | null;
  id: number;
  createdAt: Date;
};

export type FeedPost = {
  id: number;
  content: string;
  createdAt: Date;
  bookId: number | null;
  author: {
    id: number;
    username: string;
    name: string;
    profilePicture: string | null;
  };
  metrics: {
    likeCount: number;
    commentCount: number;
  };
  context: {
    isLikedByMe: boolean;
    isMine: boolean;
    isFollowed: boolean;
  };
};
