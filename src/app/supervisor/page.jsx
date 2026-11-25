import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SupervisorClient from "./supervisor-client";

export default async function SupervisorPage() {
  const cookieStore = await cookies();
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets?limit=100`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (!res.ok) redirect("/");
  const data = await res.json();

  return <SupervisorClient initialTickets={data.data} />;
}
