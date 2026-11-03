export interface AuthUser {
  id: number;
  email: string;
  authorities: string[];
}

export interface JwtPayload {
  sub: string;
  authorities: string[];
  id: number;
}
