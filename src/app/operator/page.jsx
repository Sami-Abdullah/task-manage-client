import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OperatorClient from "./operator-client";

export default async function OperatorPage() {
  const cookieStore = await cookies();
  
  // Fetch initial data on the server
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets?limit=10`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) redirect("/");
    return <div className="p-8 text-center text-error">Failed to load tickets.</div>;
  }

  const data = await res.json();

  return <OperatorClient initialTickets={data.data} />;
}