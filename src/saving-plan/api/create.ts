import { DraftPlan, Plan } from "../model/plan";
import { DatabaseService } from "../services/database-service";

export const create: (
  plan: DraftPlan,
  db: DatabaseService
) => Promise<string> = (plan, db) => {
  console.log(`Adding draft ${plan}`);
  return db.insertDraft(plan);
};
