"use client";

import { SignIn } from "@clerk/nextjs";
import { BackgroundLines } from "@/components/ui/background-lines";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  const { resolvedTheme } = useTheme();

  return (
    <BackgroundLines svgOptions={{ duration: 5 }}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="scale-90">
          <SignIn
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : undefined,
            }}
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </BackgroundLines>
  );
}
