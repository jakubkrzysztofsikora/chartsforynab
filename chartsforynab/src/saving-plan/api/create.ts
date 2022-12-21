import { Plan } from "../model/plan";

export const create: (plan: Plan) => Promise<string> = (plan) => {
  console.log(`Adding ${plan}`);
  return Promise.resolve("test");
};
