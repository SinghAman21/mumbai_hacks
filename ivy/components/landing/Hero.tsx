"use client";

import React from "react";
import { motion } from "motion/react";
import { IconSparkles, IconUsers, IconChartBar } from "@tabler/icons-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Image from "next/image";

export function Hero() {
  return (
    <BackgroundBeamsWithCollision className="min-h-screen w-full pb-20">
      <div className="relative z-10 flex flex-col items-center justify-start pt-32 px-4 sm:px-6 lg:px-8 w-full">
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
                alt="SplitSphere Logo"
                fill
                className="object-contain scale-110 dark:brightness-75"
                priority
              />
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-white">
              SplitSphere
            </span>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto text-center space-y-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Who Owes What?
              <br />
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                We Know.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Eliminate confusion and disputes. Automatically track, split, and
              simplify shared expenses for groups with AI-powered intelligence.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium hover:scale-105 transition-transform duration-200 shadow-lg">
              Get Started
            </button>
            <button className="px-8 py-3 border-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200">
              Know More
            </button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center pt-8"
          >
            <FeaturePill
              icon={<IconSparkles className="w-4 h-4" />}
              text="AI-Powered"
            />
            <FeaturePill
              icon={<IconUsers className="w-4 h-4" />}
              text="Group Friendly"
            />
            <FeaturePill
              icon={<IconChartBar className="w-4 h-4" />}
              text="Smart Analytics"
            />
          </motion.div>
        </div>

        {/* Features Section */}
        <FeaturesSection />
      </div>
    </BackgroundBeamsWithCollision>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-sm text-neutral-700 dark:text-neutral-300">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Clear Tracking",
      description: "Know exactly who paid for what, with transparent records",
      icon: "📊",
    },
    {
      title: "Auto Splitting",
      description: "Accurate cost division with smart algorithms",
      icon: "✂️",
    },
    {
      title: "Debt Simplification",
      description: "Minimize transactions with automatic debt optimization",
      icon: "🔄",
    },
    {
      title: "Fairness AI",
      description: "AI suggestions to prevent spending imbalance",
      icon: "⚖️",
    },
    {
      title: "Real-time Sync",
      description: "All members see updates instantly",
      icon: "⚡",
    },
    {
      title: "Natural Language",
      description: "Describe expenses naturally, AI understands",
      icon: "💬",
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
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
          Why Choose SplitSphere?
        </h2>
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
            className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-lg transition-shadow duration-200"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
