import { RecurringPayment } from "./recurring-payment";
import { Subcategory } from "./subcategory";

export type Savings = Array<{
  type: "recurring" | "subcategory";
  entity: RecurringPayment | Subcategory;
  percentToSave: number;
}>;
