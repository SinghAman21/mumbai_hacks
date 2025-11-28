import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <UserProfile />
    </div>
  );
}
