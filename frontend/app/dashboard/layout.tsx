import { AppSidebar } from "@/components/dashboard/app-sidebar";

export default function DashboardLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col overflow-hidden">
        {children}
        {modal}
      </div>
    </div>
  );
}
