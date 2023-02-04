import { useRouter } from "next/router";
import { List, SavingPlanContext } from "../../src/saving-plan";

export default function SavingPlansPage() {
  const router = useRouter();

  return (
    <SavingPlanContext.Provider
      value={{
        goToNewWizard: () => router.push("/saving-plans/new"),
        getSavingPlansList: (page, limit) =>
          fetch(`/api/saving-plans?page=${page}&limit=${limit}`)
            .then((res) => res.json())
            .then((res) => res.data),
      }}
    >
      <List />
    </SavingPlanContext.Provider>
  );
}
