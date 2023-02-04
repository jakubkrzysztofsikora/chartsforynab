import { DatabaseService } from "../services/database-service";
import { instanceOfDraftPlan } from "lib/instanceOf";

export const approve: (
  id: string,
  db: DatabaseService
) => Promise<string> = async (id, db) => {
  console.log(`Approving ${id}`);
  const draft = await db.get(id);

  if (instanceOfDraftPlan(draft)) {
    delete (draft as any)._id;
    delete (draft as any).id;

    return db.insert({
      ...draft,
      status: "ongoing",
      fromDraft: id,
      started: new Date(),
    });
  } else {
    return Promise.reject();
  }
};
