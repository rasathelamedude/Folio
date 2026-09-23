export interface ApiResponse<T = null> {
  success: boolean;
  data: T;
}

export interface JWTPayload {
  userId: number;
}
