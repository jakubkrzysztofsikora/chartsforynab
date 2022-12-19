import { RecurringPayment } from "./recurring-payment";
import { Subcategory } from "./subcategory";

export type SavingPlan = Array<{
  type: "recurring" | "subcategory";
  entity: RecurringPayment | Subcategory;
  percentToSave: number;
}>;
