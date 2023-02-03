import clientPromise from "lib/mongodb";
import { OptionalId, Document, ObjectId } from "mongodb";
import { DraftPlan, Plan } from "src/saving-plan/model/plan";
import { DatabaseService } from "src/saving-plan/services/database-service";
import { instanceOfPlan } from "./instanceOf";

const SAVING_PLAN_DB_NAME = "charts4ynab";
const SAVING_PLAN_COLLECTION_NAME = "saving-plans";
const DRAFT_SAVING_PLAN_COLLECTION_NAME = "draft-saving-plans";

export const savingPlanDatabaseService: DatabaseService = {
  async insert(doc) {
    const client = await clientPromise;
    const inserted = await client
      .db(SAVING_PLAN_DB_NAME)
      .collection(SAVING_PLAN_COLLECTION_NAME)
      .insertOne(doc);

    return inserted.insertedId.toHexString();
  },
  async insertDraft(doc) {
    const client = await clientPromise;
    const inserted = await client
      .db(SAVING_PLAN_DB_NAME)
      .collection(DRAFT_SAVING_PLAN_COLLECTION_NAME)
      .insertOne(doc);

    return inserted.insertedId.toHexString();
  },
  update: async function (id, doc: any) {
    delete doc.id;
    console.log({ doc });
    const client = await clientPromise;
    const updated = await client
      .db(SAVING_PLAN_DB_NAME)
      .collection(
        instanceOfPlan(doc)
          ? SAVING_PLAN_COLLECTION_NAME
          : DRAFT_SAVING_PLAN_COLLECTION_NAME
      )
      .updateOne({ _id: new ObjectId(id) }, { $set: doc });
    return updated.upsertedId.toHexString();
  },
  get: async function (id) {
    const client = await clientPromise;
    let doc: any =
      (await client
        .db(SAVING_PLAN_DB_NAME)
        .collection(SAVING_PLAN_COLLECTION_NAME)
        .findOne({ _id: new ObjectId(id) })) ||
      (await client
        .db(SAVING_PLAN_DB_NAME)
        .collection(DRAFT_SAVING_PLAN_COLLECTION_NAME)
        .findOne({ _id: new ObjectId(id) })) ||
      null;

    if (!doc) {
      return null;
    }

    doc.id = doc?._id.toHexString();
    return doc.status ? (doc as Plan) : (doc as DraftPlan);
  },
};
