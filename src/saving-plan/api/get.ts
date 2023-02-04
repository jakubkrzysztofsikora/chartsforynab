import { DraftPlan, Plan } from "../model/plan";
import { DatabaseService } from "../services/database-service";

export const get: (
  id: string,
  db: DatabaseService
) => Promise<Plan | DraftPlan | null> = (id, db) => {
  return db.get(id).catch(() => null);
};
