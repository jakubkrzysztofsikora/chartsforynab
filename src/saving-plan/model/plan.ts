import { Savings } from "./savings";

export interface DraftPlan {
  name: string;
  target: number;
  savings: Savings;
  id: string;
}

export interface Plan extends DraftPlan {
  id: string;
  status: "ongoing" | "discarded";
  started: Date;
  fromDraft: string;
}
