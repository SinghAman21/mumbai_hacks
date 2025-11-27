"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconSparkles } from "@tabler/icons-react";

interface DashboardWelcomeProps {
  userName: string | null | undefined;
  onComplete: () => void;
  isFirstTime?: boolean;
}

export function DashboardWelcome({
  userName,
  onComplete,
  isFirstTime = false,
}: DashboardWelcomeProps) {
  const [show, setShow] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 400);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-neutral-950"
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.5,
                type: "spring",
                bounce: 0.4,
              }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40"
                />
                <div className="relative bg-white dark:bg-neutral-900 p-6 rounded-full border-4 border-neutral-200 dark:border-neutral-800">
                  <IconSparkles className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="space-y-2"
            >
              <h1 className="text-5xl font-bold text-neutral-900 dark:text-white">
                {getGreeting()}!
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-2xl text-neutral-600 dark:text-neutral-400"
              >
                {isFirstTime ? "Welcome" : "Welcome back"},{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {userName || "there"}
                </span>
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex items-center justify-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
                className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
                className="w-2 h-2 bg-pink-600 dark:bg-pink-400 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
