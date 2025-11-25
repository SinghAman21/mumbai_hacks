import { AppSidebar } from "@/components/dashboard/appsidebar";
export default function DashboardLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <AppSidebar userEmail="user@example.com" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
        {modal}
      </div>
    </div>
  );
}
