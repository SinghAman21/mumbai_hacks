import DashHeader from "@/components/dashboard/DashHeader";
// import DashHeader from "@/components/dashboard/dashheader";
import Image from "next/image";

export default function DashBoard() {
  return (
    <div className="flex flex-col h-full">
      <DashHeader />
      <main className="flex-1 overflow-auto p-4">
        {/* Dashboard content goes here */}
      </main>
    </div>
  );
}
