export type User = {
  id: number;
  email: string;
  roles: UserRole[];
};

export type UserRole = "ROLE_ADMIN" | "ROLE_LIBRAIRIAN" | "ROLE_USER";
