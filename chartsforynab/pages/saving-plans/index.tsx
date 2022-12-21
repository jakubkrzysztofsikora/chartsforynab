import { useRouter } from "next/router";
import { List, SavingPlanContext } from "../../src/saving-plan";

export default function SavingPlansPage() {
  const router = useRouter();

  return (
    <SavingPlanContext.Provider
      value={{
        goToNewWizard: () => router.push("/saving-plans/new"),
      }}
    >
      <List />
    </SavingPlanContext.Provider>
  );
}
