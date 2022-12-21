import { useRouter } from "next/router";
import { New, SavingPlanContext } from "../../../src/saving-plan";

export default function NewPlanPage() {
  const router = useRouter();

  return (
    <SavingPlanContext.Provider
      value={{
        createService: async (plan) => {
          const response = await fetch("/api/saving-plans", {
            method: "POST",
            body: JSON.stringify(plan),
          });
          const body: { data: { createdId: string } } = await response.json();

          return body.data.createdId;
        },
        goToApprovalPage: (id) => router.push(`/saving-plans/approve/${id}`),
        goToNewWizard: () => router.push("/saving-plans/new"),
      }}
    >
      <New />
    </SavingPlanContext.Provider>
  );
}
