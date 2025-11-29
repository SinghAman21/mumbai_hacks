"use client";

import React from "react";
import { motion } from "motion/react";
import {
  IconChartBar,
  IconScissors,
  IconRefresh,
  IconScale,
  IconBolt,
  IconMessage,
} from "@tabler/icons-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div>
      {/* First Section with Shape Landing Hero */}
      <div className="relative">
        {/* Logo & Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-8 left-8 flex items-center gap-4 z-50"
        >
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 relative rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <Image
                src="/logo.png"
                alt="SpendSplit Logo"
                fill
                className="object-contain scale-110 dark:brightness-75"
                priority
              />
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-white">
              SpendSplit
            </span>
          </div>
        </motion.div>

        <HeroGeometric title1="Who Owes What?" title2="We Know." />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row gap-4 justify-center items-center z-10"
        >
          <Link href="/sign-up">
            <button className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:scale-105 transition-transform duration-200 shadow-lg">
              Get Started
            </button>
          </Link>
          <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200">
            Know More
          </button>
        </motion.div>

        {/* Smooth Gradient Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-b from-transparent to-neutral-50 dark:to-neutral-950 z-5 pointer-events-none" />
      </div>

      {/* Second Section with Background Beams */}
      <div className="relative -mt-1">
        <BackgroundBeamsWithCollision className="min-h-screen w-full pb-20">
          <FeaturesSection />
        </BackgroundBeamsWithCollision>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Clear Tracking",
      description: "Know exactly who paid for what, with transparent records",
      icon: <IconChartBar className="w-8 h-8" />,
    },
    {
      title: "Auto Splitting",
      description: "Accurate cost division with smart algorithms",
      icon: <IconScissors className="w-8 h-8" />,
    },
    {
      title: "Debt Simplification",
      description: "Minimize transactions with automatic debt optimization",
      icon: <IconRefresh className="w-8 h-8" />,
    },
    {
      title: "Fairness AI",
      description: "AI suggestions to prevent spending imbalance",
      icon: <IconScale className="w-8 h-8" />,
    },
    {
      title: "Real-time Sync",
      description: "All members see updates instantly",
      icon: <IconBolt className="w-8 h-8" />,
    },
    {
      title: "Natural Language",
      description: "Describe expenses naturally, AI understands",
      icon: <IconMessage className="w-8 h-8" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full max-w-6xl mx-auto py-20 px-4"
    >
      <div className="text-center space-y-4 mb-12">
        <TypewriterEffect
          words={[{ text: "Why" }, { text: "Choose" }, { text: "SpendSplit?" }]}
          className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white"
        />
        <p className="text-neutral-600 dark:text-neutral-400">
          Making shared expenses simple, fair, and transparent
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500" />
            <div className="relative p-6 bg-neutral-50 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 h-full">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-lg bg-linear-to-br from-indigo-500/10 to-rose-500/10 dark:from-indigo-500/20 dark:to-rose-500/20 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
