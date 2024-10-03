import { db } from "@/lib/db";

export class BankAccountDAO {
  static async createBankAccount(payload: any) {
    return db.bankAccount.create({ data: payload });
  }

  static async getAllBankAccounts(userId: string) {
    return db.bankAccount.findMany({
      where: { userId },
    });
  }

  static async updateBankAccount(id: string, payload: any) {
    return db.bankAccount.update({
      where: { id },
      data: payload,
    });
  }

  static async getBankAccountById(id: string) {
    return db.bankAccount.findUnique({
      where: { id },
    });
  }
}
