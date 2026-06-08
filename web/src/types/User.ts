export type UserSignupData = {
  email: string;
  password: string;
  name: string;
  username: string;
  profilePicture?: string;
};

export type UserLoginData = {
  email: string;
  password: string;
};

interface SimpleUser {
  id: number;
  name: string;
  username: string;
  profilePicture: string | null;
};

export type Follower = SimpleUser;
export type Following = SimpleUser;
