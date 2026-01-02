"use client";

import React, { useState } from "react";
import DashHeader from "@/components/dashboard/dash-header";
import { motion } from "framer-motion";
import { IconBrandGithub } from "@tabler/icons-react";

export default function AboutPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-gray-50 dark:bg-neutral-950">
      <DashHeader onSearch={setSearchQuery} />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          
          {/* Hero Section */}
          <motion.div 
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition}
            className="text-center space-y-4 py-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              About SplitEasy
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Simplifying group expenses and shared finances for everyone. 
              Seamless, transparent, and easy to use.
            </p>
          </motion.div>

          {/* Mission & Vision */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeIn} className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-2xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">Our Mission</h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                We believe that sharing expenses shouldn't damage relationships. Our mission is to provide a platform that removes the awkwardness from splitting bills, ensuring everyone pays their fair share without the hassle of manual calculations.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-2xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">Why SplitEasy?</h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Whether it's a house share, a group trip, or a night out, SplitEasy keeps track of who owes what. With real-time updates and intuitive design, settling up has never been this stress-free.
              </p>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-center text-neutral-800 dark:text-neutral-200">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Expense Tracking", desc: "Keep a record of every penny spent." },
                { title: "Fair Splitting", desc: "Automated calculations for even or custom splits." },
                { title: "Reports", desc: "Visual insights into your group's spending habits." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm"
                >
                  <h4 className="font-semibold text-lg mb-2 text-neutral-800 dark:text-neutral-100">{feature.title}</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact / Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center pt-10 border-t border-neutral-200 dark:border-neutral-800"
          >
            <p className="text-neutral-500 dark:text-neutral-500 mb-4">Built with ❤️ for Mumbai Hacks</p>
            <div className="flex justify-center gap-4">
              <a href="https://github.com/SinghAman21/mumbai_hacks" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                <IconBrandGithub size={20} />
              </a>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
