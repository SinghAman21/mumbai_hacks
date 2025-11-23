import { AppSidebar } from "@/components/dashboard/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <AppSidebar userEmail="user@example.com" />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
