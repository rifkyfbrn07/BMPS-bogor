import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminRegistrations from "@/components/AdminRegistrations";

export default async function AdminPage() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) redirect("/login");
  return <div className="section-shell py-12 sm:py-16"><AdminRegistrations /></div>;
}
