import { DraftPlan, Plan } from "src/saving-plan/model/plan";

export function instanceOfPlan(object: any): object is Plan {
  return "status" in object;
}

export function instanceOfDraftPlan(object: any): object is DraftPlan {
  return !("status" in object) && "savings" in object;
}
