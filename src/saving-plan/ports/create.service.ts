import { DraftPlan } from "../model/plan";

export type CreateDraft = (plan: DraftPlan) => Promise<string>;
