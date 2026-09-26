import axios from "./axios";
import type { Post, EditablePost, PostInsert, FeedPost } from "~/types/posts";
import type { Like } from "~/types/likes";
import type {
  AddToReadListApiResponse,
  GetUserReadListApiResponse,
  GoogleBook,
  GoogleBookVolume,
  LocalBook,
  ReadListBook,
} from "~/types/books";
import type { ApiResponse } from "~/types/api";

export async function getFeed(cursor?: string): Promise<{
  posts: FeedPost[];
  nextCursor: string | null;
}> {
  const response = await axios.get("/content/feed", { params: { cursor } });

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting feed");
  }

  return data.data;
}
export async function getBookByName(bookName: string): Promise<{
  books: GoogleBookVolume[];
}> {
  const response = await axios.get(`/content/books`, {
    params: { book_name: bookName },
  });

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting book");
  }

  return data.data;
}
export async function sharePost(postData: PostInsert): Promise<Post> {
  const response = await axios.post("/content/posts", postData);

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when sharing post");
  }

  return data.data;
}
export async function editPost(
  postId: number,
  postData: EditablePost,
): Promise<Post> {
  const response = await axios.patch(`/content/posts/${postId}`, postData);

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when editing post");
  }

  return data.data;
}
export async function deletePost(postId: number): Promise<boolean> {
  const response = await axios.delete(`/content/posts/${postId}`);

  if (response.status !== 204) {
    throw new Error("Something went wrong when deleting post");
  }

  return true;
}
export async function like(likeData: {
  commentId?: number;
  postId?: number;
}): Promise<Like> {
  const payload: { commentId?: number; postId?: number } = {};

  if (likeData.commentId !== undefined) payload.commentId = likeData.commentId;
  if (likeData.postId !== undefined) payload.postId = likeData.postId;

  const response = await axios.post("/content/likes", payload);

  const data = response.data;

  if (!data.success) {
    throw new Error("Error occured while liking content.");
  }

  return data.data;
}
export async function deleteLike(likeData: {
  postId?: number;
  commentId?: number;
}): Promise<boolean> {
  const hasPostId = likeData.postId !== undefined;
  const hasCommentId = likeData.commentId !== undefined;

  if (hasPostId === hasCommentId) {
    throw new Error("Provide either postId or commentId, but not both.");
  }

  let url: string = `/content/likes`;
  if (hasPostId && !hasCommentId) {
    url = `/content/likes?postID=${likeData.postId}`;
  } else if (!hasPostId && hasCommentId) {
    url = `/content/likes?commentID=${likeData.commentId}`;
  }

  const response = await axios.delete(url);

  if (response.status !== 204) {
    throw new Error("Error occured while removing like on content.");
  }

  return true;
}

export async function comment(postId: number, content: string) {
  const response = await axios.post("/content/comments", {
    postId,
    content,
  });

  const data = response.data;

  if (!data.success) {
    throw new Error("");
  }

  return data.data;
}

export async function deleteComment(commentId: number): Promise<boolean> {
  const response = await axios.delete(`/content/comments/${commentId}`);

  if (response.status !== 204) {
    throw new Error("Error occuered while deleting comment.");
  }

  return true;
}

export async function getPostsOfUser(userId: number) {
  const response = await axios.get(`/content/users/${userId}/posts`);

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting posts of user");
  }

  return data.data;
}
export async function getPostById(postId: number) {
  const response = await axios.get(`/content/posts/${postId}`);

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting post");
  }

  return data.data;
}

export async function followUser(followedUserId: number) {
  const response = await axios.post("/content/follows", {
    followed_user_id: followedUserId,
  });

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when following user");
  }

  return data.data;
}
export async function unfollowUser(followingUserId: number): Promise<boolean> {
  const response = await axios.delete(
    `/content/follows?followingUserId=${followingUserId}`,
  );

  if (response.status !== 204) {
    throw new Error("Something went wrong when unfollowing user");
  }

  return true;
}

export async function getTrendingBooks() {
  const response = await axios.get("/content/books/trending");

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting trending books");
  }

  return data.data;
}

export async function getSuggestedUsers() {
  const response = await axios.get("/content/users/suggestions");

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting suggested users");
  }

  return data.data;
}

export async function getUserReadList(): Promise<ReadListBook[]> {
  const response = await axios.get<GetUserReadListApiResponse>(
    "/content/users/me/books",
  );

  const { data, success } = response.data;

  if (!success) {
    throw new Error("Something went wrong when getting read list");
  }

  return data.readList;
}

export async function addToReadList(payload: GoogleBook): Promise<LocalBook> {
  const response = await axios.post<AddToReadListApiResponse>(
    "/content/users/me/books",
    payload,
  );

  const { data, success } = response.data;

  if (!success) {
    throw new Error("Something went wrong when adding to read list");
  }

  return data.book;
}

export async function removeFromReadList(bookId: number) {
  const response = await axios.delete<ApiResponse>(
    `/content/users/me/books/${bookId}`,
  );

  const { success } = response.data;

  if (!success) {
    throw new Error("Something went wrong when removing from read list");
  }
}
