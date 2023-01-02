import { Plan } from "../model/plan";

export const update: (plan: Plan) => Promise<string> = (plan) => {
  console.log(`Updating ${plan}`);
  return Promise.resolve(plan.id);
};
