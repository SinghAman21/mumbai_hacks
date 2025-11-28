"use client";

import { SignUp } from "@clerk/nextjs";
import { BackgroundLines } from "@/components/ui/background-lines";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  const { resolvedTheme } = useTheme();

  return (
    <BackgroundLines svgOptions={{ duration: 5 }}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="scale-90">
          <SignUp
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : undefined,
            }}
            fallbackRedirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </BackgroundLines>
  );
}
