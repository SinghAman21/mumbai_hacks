"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { joinGroup } from "@/lib/api";
import { IconLoader2, IconCircleCheck, IconAlertCircle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function JoinPage() {
    const params = useParams();
    const token = params.token as string;
    const router = useRouter();
    const { getToken, isLoaded: authLoaded } = useAuth();
    const { isLoaded: userLoaded, isSignedIn } = useUser();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Joining group...");

    useEffect(() => {
        if (!authLoaded || !userLoaded) return;

        if (!isSignedIn) {
            // Redirect to sign in, preserving the return URL
            const returnUrl = encodeURIComponent(`/join/${token}`);
            router.push(`/sign-in?redirect_url=${returnUrl}`);
            return;
        }

        const join = async () => {
            try {
                const authToken = await getToken();
                await joinGroup(token, authToken);
                setStatus("success");
                setMessage("Successfully joined the group!");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            } catch (error: any) {
                console.error("Failed to join group", error);
                setStatus("error");
                setMessage(error.message || "Failed to join group. The link may be invalid or expired.");
            }
        };

        join();
    }, [token, authLoaded, userLoaded, isSignedIn, getToken, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md p-8 border rounded-xl bg-card shadow-lg text-center space-y-6">
                {status === "loading" && (
                    <>
                        <div className="flex justify-center">
                            <IconLoader2 className="w-12 h-12 animate-spin text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Joining Group...</h2>
                        <p className="text-muted-foreground">Please wait while we verify your invite.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <IconCircleCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">Success!</h2>
                        <p className="text-muted-foreground">{message}</p>
                        <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <IconAlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Error</h2>
                        <p className="text-muted-foreground">{message}</p>
                        <Button onClick={() => router.push("/dashboard")} className="mt-4">
                            Go to Dashboard
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
