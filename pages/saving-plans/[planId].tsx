import { useRouter } from "next/router";
import React from "react";
import { Details, SavingPlanContext } from "../../src/saving-plan";
import { Plan } from "../../src/saving-plan/model/plan";

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = React.useState<Plan>({
    id: router.query.planId as string,
    name: "Test",
    status: "ongoing",
    target: 10000,
    started: new Date(2022, 10, 1),
    savings: [
      {
        entity: {
          payee: "HBO",
          amount: 29.9,
          id: "test1",
          subcategory: "VOD / Muzyka",
        },
        percentToSave: 100,
        type: "recurring",
      },
      {
        entity: {
          id: "test2",
          name: "Spozywcze",
          category: "Dom",
          avgAmount: 2123,
        },
        percentToSave: 5,
        type: "subcategory",
      },
    ],
  });
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
