import { useRouter } from "next/router";

export default function PlanPage() {
  const router = useRouter();
  return <div>{router.query.planId}</div>;
}
