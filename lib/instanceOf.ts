import { DraftPlan, Plan } from "src/saving-plan/model/plan";

export function instanceOfPlan(object: any): object is Plan {
  const type = typeof object;
  return "status" in object;
}

export function instanceOfDraftPlan(object: any): object is DraftPlan {
  const type = typeof object;
  return !("status" in object);
}
