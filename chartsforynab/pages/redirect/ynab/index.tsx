import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  console.log(router.query);
  return <div>{router.query["access_token"]}</div>;
}
