import { useRouter } from "next/router";
import NewPlanPage from ".";

export default function NewPlanFromDraftPage() {
  const { draftId } = useRouter().query;

  return <NewPlanPage draftId={draftId as string} />;
}
