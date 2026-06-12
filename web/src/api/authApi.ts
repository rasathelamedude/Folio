import { type UserSignupData, type UserLoginData } from "../types/User";
import axios from "./axios";

export async function login({ email, password }: UserLoginData) {
  const response = await axios.post("/auth/login", {
    email,
    password,
  });

  const data = response.data;

  if (!data) {
    throw new Error("Something went wrong");
  }

  return data.data;
}

export async function signup({
  email,
  password,
  name,
  username,
  profilePicture,
}: UserSignupData) {
  const response = await axios.post("/auth/signup", {
    email,
    password,
    name,
    username,
    profilePicture,
  });

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when signing up");
  }

  return data.data;
}

export async function getProfile() {
  const response = await axios.get("/auth/me");

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when getting profile");
  }

  return data.data;
}

export async function logout() {
  const response = await axios.post("/auth/logout");

  const data = response.data;

  if (!data.success) {
    throw new Error("Something went wrong when logging out");
  }

  return data.data;
}

export function signInWithGoogle() {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?client=web`;
}
