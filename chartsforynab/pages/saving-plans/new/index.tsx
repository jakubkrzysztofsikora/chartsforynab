import { useRouter } from "next/router";
import { New, SavingPlanContext } from "../../../src/saving-plan";

export default function NewPlanPage(props: { draftId?: string }) {
  const router = useRouter();
  const { draftId } = props;

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
      <New
        fromDraft={
          draftId
            ? {
                name: "test",
                id: draftId as string,
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
              }
            : undefined
        }
      />
    </SavingPlanContext.Provider>
  );
}

const toJson: <TOutput>(response: Response) => Promise<TOutput> = async (
  response: Response
) => {
  return await response.json();
};
