import { Savings } from "./savings";

export type DraftPlan = {
  name: string;
  target: number;
  savings: Savings;
};

export type Plan = DraftPlan & {
  id: string;
  status: "draft" | "ongoing" | "discarded";
};
