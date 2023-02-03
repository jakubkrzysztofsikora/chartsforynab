import { Plan } from "../model/plan";
import { DatabaseService } from "../services/database-service";

export const update: (plan: Plan, db: DatabaseService) => Promise<string> = (
  plan,
  db
) => {
  console.log(`Updating ${plan}`);
  const id = plan.id;

  if (id) {
    return db.update(id, { ...plan });
  }

  return Promise.reject();
};
