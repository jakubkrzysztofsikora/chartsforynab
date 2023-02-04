import { DraftPlan, Plan } from "../model/plan";

export interface DatabaseService {
  update: (id: string, doc: Plan) => Promise<string | null>;
  insertDraft: (doc: DraftPlan) => Promise<string>;
  insert: (doc: Plan) => Promise<string>;
  get: (id: string) => Promise<Plan | DraftPlan | null>;
  list: (page: number, limit: number) => Promise<(Plan | DraftPlan)[]>;
}
