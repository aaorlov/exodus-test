import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

type UpdateUserType = Prisma.Args<typeof db.user, "update">["data"];

export class UserDAO {
  static async createUser(payload: any) {
    return db.user.create({ data: payload });
  }

  static async getUserById(id: string) {
    return db.user.findUnique({ where: { id } });
  }

  static async getUserByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  }

  static async updateUser(id: string, payload: UpdateUserType) {
    return db.user.update({
      where: { id },
      data: payload,
    });
  }
}