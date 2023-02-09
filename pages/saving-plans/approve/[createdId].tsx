import { instanceOfDraftPlan } from "lib/instanceOf";
import { useRouter } from "next/router";
import React from "react";
import { DraftPlan } from "src/saving-plan/model/plan";
import { Approve, SavingPlanContext } from "../../../src/saving-plan";

export default function ApprovePlanPage() {
  const router = useRouter();
  const [plan, setPlan] = React.useState<DraftPlan | "not-found">();

  React.useEffect(() => {
    if (router.query.createdId) {
      fetch(`/api/saving-plans/${router.query.createdId}`)
        .then((res) => res.json())
        .then((plan) => {
          if (instanceOfDraftPlan(plan)) {
            setPlan(plan);
          } else {
            console.log({ plan });
            setPlan("not-found");
          }
        });
    }
  }, [router.query.createdId]);

  return plan === "not-found" ? (
    <>Not found placeholder</>
  ) : (
    <SavingPlanContext.Provider
      value={{
        today: () => new Date(),
        goBack: () =>
          router.push(`/saving-plans/new/${router.query.createdId}`),
        approvePlan: async (id) => {
          const inserted = await (
            await fetch(`/api/saving-plans/${id}/approve`, {
              method: "PUT",
              body: JSON.stringify(plan),
            })
          ).json();

          return inserted.id;
        },
        goToPlanDetails: (id) => router.push(`/saving-plans/${id}`),
        plan: plan
          ? {
              ...plan,
              status: "ongoing",
              started: new Date(),
              fromDraft: plan.id,
            }
          : undefined,
      }}
    >
      <Approve />
    </SavingPlanContext.Provider>
  );
}
