import { type UserSignupData, type UserLoginData } from "../types/User";
import axios from "./axios";

export async function login({ email, password }: UserLoginData) {
  try {
    const response = await axios.post("/auth/login", {
      email,
      password,
    });

    const data = response.data;

    if (!data) {
      throw new Error("Something went wrong");
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error occured while loging in: ", error.message);
      throw error;
    }
  }
}

export async function signup({
  email,
  password,
  name,
  username,
  profilePicture,
}: UserSignupData) {
  try {
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

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error?.message);
      throw error;
    }
  }
}

export async function getProfile() {
  try {
    const response = await axios.get("/auth/me");

    const data = response.data;

    if (!data.success) {
      throw new Error("Something went wrong when getting profile");
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        error?.message ?? "Something went wrong when getting profile",
      );
      throw error;
    }
  }
}

export async function logout() {
  try {
    const response = await axios.post("/auth/logout");

    const data = response.data;

    if (!data.success) {
      throw new Error("Something went wrong when logging out");
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error?.message);
      throw error;
    }
  }
}

export async function signInWithGoogle() {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?clie`;
}
