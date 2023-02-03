import { DatabaseService } from "../services/database-service";
import { DraftPlan } from "../model/plan";
import { instanceOfDraftPlan } from "lib/instanceOf";

export const approve: (
  id: string,
  db: DatabaseService
) => Promise<string> = async (id, db) => {
  console.log(`Approving ${id}`);
  const draft = await db.get(id);

  if (instanceOfDraftPlan(draft)) {
    return db.insert({
      ...draft,
      status: "ongoing",
      fromDraft: draft.id,
      started: new Date(),
    });
  } else {
    return Promise.reject();
  }
};
