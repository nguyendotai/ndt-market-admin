import { createCrudService } from "@/services/crud-service";

export type UserServiceItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

const service = createCrudService<UserServiceItem>("/users");

export const userService = {
  listUsers: service.list,
  getUserById: service.getById,
  createUser: service.create,
  updateUser: service.update,
  deleteUser: service.remove,
};

