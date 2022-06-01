/**
 * Contract for defining user
 */
export interface IUser {
  _id: string;
  email: string;
  name: string;
  password?: string;
  role: IRole;

  // Añadido createdAt y updatedAt de mongo
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Contract for defining user role
 */
export type IRole = "admin" | "client";
