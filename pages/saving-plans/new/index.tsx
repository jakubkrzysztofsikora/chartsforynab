import { instanceOfDraftPlan } from "lib/instanceOf";
import { useRouter } from "next/router";
import React from "react";
import { DraftPlan } from "src/saving-plan/model/plan";
import { New, SavingPlanContext } from "../../../src/saving-plan";

export default function NewPlanPage(props: { draftId?: string }) {
  const router = useRouter();
  const { draftId } = props;
  const [plan, setPlan] = React.useState<DraftPlan>();

  React.useEffect(() => {
    if (draftId) {
      fetch(`/api/saving-plans/${draftId}`)
        .then((res) => res.json())
        .then((plan) => {
          if (instanceOfDraftPlan(plan)) {
            setPlan(plan);
          } else {
            setPlan(undefined);
          }
        });
    }
  }, [draftId]);

  return (
    <SavingPlanContext.Provider
      value={{
        createService: async (plan) => {
          const response = await fetch("/api/saving-plans", {
            method: draftId ? "PUT" : "POST",
            body: JSON.stringify({ ...plan, id: draftId }),
          });
          const body = await toJson<{
            data: { createdId?: string; updatedId?: string };
          }>(response);

          if (!body.data.createdId && !body.data.updatedId) {
            throw new Error(
              `Problems with the request ${JSON.stringify(response)}`
            );
          }

          return body.data.createdId || body.data.updatedId || "";
        },
        goToApprovalPage: (id) => router.push(`/saving-plans/approve/${id}`),
        goToNewWizard: () => router.push("/saving-plans/new"),
      }}
    >
      {draftId && !plan ? <>Loading</> : <New fromDraft={plan} />}
    </SavingPlanContext.Provider>
  );
}

const toJson: <TOutput>(response: Response) => Promise<TOutput> = async (
  response: Response
) => {
  return await response.json();
};
