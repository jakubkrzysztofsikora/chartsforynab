import { instanceOfDraftPlan } from "lib/instanceOf";
import { useRouter } from "next/router";
import React from "react";
import { DraftPlan } from "src/saving-plan/model/plan";
import { Approve, SavingPlanContext } from "../../../src/saving-plan";

export default function ApprovePlanPage() {
  const router = useRouter();
  const [plan, setPlan] = React.useState<DraftPlan>();

  React.useEffect(() => {
    if (router.query.createdId) {
      fetch(`/api/saving-plans/${router.query.createdId}`)
        .then((res) => res.json())
        .then((plan) => {
          if (instanceOfDraftPlan(plan)) {
            setPlan(plan);
          }
        });
    }
  }, [router.query.createdId]);

  return (
    <SavingPlanContext.Provider
      value={{
        goBack: () =>
          router.push(`/saving-plans/new/${router.query.createdId}`),
        approvePlan: async (id) => {
          await fetch(`/api/savings-plans/${id}/approve`, {
            method: "PUT",
            body: JSON.stringify(plan),
          });
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
