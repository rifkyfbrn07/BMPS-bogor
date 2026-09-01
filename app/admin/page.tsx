import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminRegistrations from "@/components/AdminRegistrations";

export default async function AdminPage() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) redirect("/login");
  
  const adminUser = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, role: true },
  });

  return (
    <div className="min-h-screen w-full bg-[#f3f6fb]">
      <AdminRegistrations 
        currentAdmin={adminUser ?? { id: session.id, name: "Admin", email: "admin@bmpsbogor.or.id", role: session.role }} 
      />
    </div>
  );
}
