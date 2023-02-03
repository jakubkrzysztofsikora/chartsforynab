import { instanceOfPlan } from "lib/instanceOf";
import { useRouter } from "next/router";
import React from "react";
import { Details, SavingPlanContext } from "../../src/saving-plan";
import { Plan } from "../../src/saving-plan/model/plan";

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = React.useState<Plan>();

  React.useEffect(() => {
    if (router.query.createdId) {
      fetch(`/api/saving-plans/${router.query.planId}`)
        .then((res) => res.json())
        .then((plan) => {
          if (instanceOfPlan(plan)) {
            setPlan(plan);
          }
        });
    }
  }, [router.query.createdId, router.query.planId]);

  return (
    <SavingPlanContext.Provider
      value={{
        transactionService: {
          getByPayeeAndMonth(payee, month, year) {
            console.log({ payee, month, year });
            return Promise.resolve([
              {
                month: 12,
                year: 2022,
                payee: "HBO",
                amount: 29.9,
                category: "",
                subcategory: "",
                id: " test",
              },
            ]);
          },
          getBySubcategoryAndMonth(subcategory, month, year) {
            console.log({ subcategory, month, year });
            return Promise.resolve([]);
          },
          getTotalSpentPerMonth() {
            return Promise.resolve([
              {
                month: new Date(2022, 1, 1),
                spent: 400,
              },
            ]);
          },
        },
        plan,
      }}
    >
      <Details />
    </SavingPlanContext.Provider>
  );
}
