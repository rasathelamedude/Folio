import axios from "./axios";
import {
  type Post,
  type EditablePost,
  type ShareablePost,
  type Like,
  type FeedPost,
} from "../types/Content";
import type { GoogleBooksApiResponse } from "../types/GoogleBooks";

export async function getFeed(): Promise<{
  posts: FeedPost[];
  cursor: string | null;
}> {
  const response = await axios.get("/content/feed");

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting feed");
  }

  return data.data;
}
export async function getBookByName(
  bookName: string,
): Promise<GoogleBooksApiResponse> {
  const response = await axios.get(`/content/books?book_name=${bookName}`);

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting book");
  }

  return data.data;
}
export async function sharePost(postData: ShareablePost): Promise<Post> {
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
export async function like(postId?: number, commentId?: number): Promise<Like> {
  const response = await axios.post("/content/likes", {
    commentId: commentId !== undefined ? commentId : null,
    postId: postId !== undefined ? postId : null,
  });

  const data = response.data;

  if (!data.success) {
    throw new Error("Error occured while liking content.");
  }

  return data.data;
}
export async function deleteLike(
  postId?: number,
  commentId?: number,
): Promise<boolean> {
  const hasPostID = postId !== undefined;
  const hasCommentId = commentId !== undefined;

  let url: string;
  if (hasPostID && !hasCommentId) {
    url = `/content/likes?postID=${postId}`;
  } else {
    url = `/content/likes?commentID=${commentId}`;
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

// TODO: implement
// export async function getUserReadList() {}
// export async function addToReadList() {}
// export async function removeFromReadList() {}
