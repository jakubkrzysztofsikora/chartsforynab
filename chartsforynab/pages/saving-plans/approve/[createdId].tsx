import { useRouter } from "next/router";
import { Approve, SavingPlanContext } from "../../../src/saving-plan";

export default function ApprovePlanPage() {
  const router = useRouter();
  return (
    <SavingPlanContext.Provider value={{}}>
      <Approve
        plan={{
          name: router.query.createdId as string,
          id: router.query.createdId as string,
          target: 1000,
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
          status: "draft",
        }}
      />
    </SavingPlanContext.Provider>
  );
}
