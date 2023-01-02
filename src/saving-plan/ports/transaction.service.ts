import { Transaction } from "../model/transaction";

export type TransactionService = {
  getByPayeeAndMonth(
    payee: string,
    month: number,
    year: number
  ): Promise<Transaction[]>;
  getBySubcategoryAndMonth: (
    subcategory: string,
    month: number,
    year: number
  ) => Promise<Transaction[]>;
  getTotalSpentPerMonth: () => Promise<{ month: Date; spent: number }[]>;
};
