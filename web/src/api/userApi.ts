import axios from "./axios";
import { type Follower, type Following } from "../types/User";

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

export async function updateUserAccount() {}

export async function deleteUserAccount() {}

export async function getUserByUsername() {}
