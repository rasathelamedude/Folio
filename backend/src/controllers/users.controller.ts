import { JWTService } from "../lib/jwt";
import { UserService } from "../services/users.service";
import { UserAccountUpdate, UserProfile } from "../types/User";

export class UserController {
  static async deleteAccount({
    userId,
  }: {
    userId: number;
  }): Promise<Response> {
    try {
      await UserService.deleteAccount({ userId });

      return new Response("", {
        status: 204,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status = 500;
      let message = "An error occurred while deleting the account";

      if (error?.message === "USER_NOT_DELETED") {
        status = 404;
        message = "User not found";
      }

      const response = {
        success: false,
        error: message,
      };

      return new Response(JSON.stringify(response), {
        status: status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  static async updateAccount({
    userId,
    body,
  }: {
    userId: number;
    body: UserAccountUpdate;
  }): Promise<Response> {
    try {
      const updatedUser = await UserService.updateAccount(userId, body);

      const response = {
        success: true,
        data: {
          user: {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            name: updatedUser.name,
            profilePicture: updatedUser.profilePicture,
          },
          message: "Account updated successfully",
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status = 500;
      let message = "An error occurred while updating the account";

      if (error?.message === "USER_NOT_FOUND") {
        status = 404;
        message = "User not found";
      } else if (error?.message === "USERNAME_IN_USE") {
        status = 409;
        message = "Username already taken";
      } else if (error?.message === "EMAIL_IN_USE") {
        status = 409;
        message = "Email already in use";
      }

      const response = {
        success: false,
        error: message,
      };

      return new Response(JSON.stringify(response), {
        status: status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  static async getUserByUsername(username: string): Promise<Response> {
    try {
      const user: UserProfile = await UserService.getUserByUsername(username);

      const response = {
        success: true,
        data: {
          user,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status = 500;
      let message = "An error occurred while fetching the user";

      if (error?.message === "USER_NOT_FOUND") {
        status = 404;
        message = "User not found";
      }

      const response = {
        success: false,
        error: message,
      };

      return new Response(JSON.stringify(response), {
        status: status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  static async getUserFollowers(userId: number): Promise<Response> {
    try {
      const followers = await UserService.getUserFollowers(userId);

      const response = {
        success: true,
        data: {
          followers,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while fetching followers";

      if (error?.message === "USER_NOT_FOUND") {
        status = 404;
        message = "User not found";
      }

      const response = {
        success: false,
        error: message,
      };

      return new Response(JSON.stringify(response), {
        status: status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  static async getUserFollowings(userId: number): Promise<Response> {
    try {
      const followings = await UserService.getUserFollowings(userId);

      const response = {
        success: true,
        data: {
          followings,
        },
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let status: number = 500;
      let message: string = "An error occurred while fetching followings";

      if (error?.message === "USER_NOT_FOUND") {
        status = 404;
        message = "User not found";
      }

      const response = {
        success: false,
        error: message,
      };

      return new Response(JSON.stringify(response), {
        status: status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
