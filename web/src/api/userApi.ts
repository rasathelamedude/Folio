import axios from "./axios";
import {
  type Follower,
  type Following,
  type UserAccountUpdate,
  type User,
} from "../types/User";

export async function getUserFollowers(userId: number): Promise<Follower[]> {
  const response = await axios.get(`/users/${userId}/followers`);

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting followers");
  }

  return data.data;
}

export async function getUserFollowings(userId: number): Promise<Following[]> {
  const response = await axios.get(`/users/${userId}/followings`);

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting followings");
  }

  return data.data;
}

export async function updateUserAccount(userData: UserAccountUpdate) {
  const response = await axios.patch("/users/account", userData);

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when updating account");
  }

  return data.data;
}

export async function deleteUserAccount(): Promise<boolean> {
  const response = await axios.delete("/users/account");

  if (response.status !== 204) {
    throw new Error("Something went wrong when deleting account");
  }

  return true;
}

export async function getUserByUsername(username: string): Promise<User> {
  const response = await axios.get(`/users?username=${username}`);

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting user");
  }

  return data.data;
}
