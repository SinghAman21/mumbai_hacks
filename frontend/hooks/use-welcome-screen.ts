"use client";

import { useState, useEffect } from "react";

interface UseWelcomeScreenProps {
  isLoaded: boolean;
  user: any; // Clerk user object
}

interface UseWelcomeScreenReturn {
  showWelcome: boolean;
  isFirstTime: boolean;
  setShowWelcome: (show: boolean) => void;
}

export function useWelcomeScreen({
  isLoaded,
  user,
}: UseWelcomeScreenProps): UseWelcomeScreenReturn {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const lastWelcomeDate = localStorage.getItem("lastWelcomeDate");
    const userCreatedAt = user.createdAt;
    const now = new Date();
    const today = now.toDateString();

    // Check if user is first-time (created within last 24 hours)
    const isNewUser =
      userCreatedAt &&
      now.getTime() - new Date(userCreatedAt).getTime() < 24 * 60 * 60 * 1000;

    if (!lastWelcomeDate) {
      // First time ever seeing welcome screen
      setIsFirstTime(!!isNewUser);
      setShowWelcome(true);
      localStorage.setItem("lastWelcomeDate", today);
    } else if (lastWelcomeDate !== today) {
      // Show welcome once per day for returning users
      setIsFirstTime(false);
      setShowWelcome(true);
      localStorage.setItem("lastWelcomeDate", today);
    }
  }, [isLoaded, user]);

  return {
    showWelcome,
    isFirstTime,
    setShowWelcome,
  };
}