"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-bold text-xl text-neutral-800 dark:text-white py-1 flex items-center gap-2"
    >
      <div className="h-10 w-10 relative rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600">
        <Image
          src="/logo.png"
          alt="SpendSplit Logo"
          fill
          className="object-contain scale-110 dark:brightness-75"
          priority
        />
      </div>
      <span className="font-bold text-lg whitespace-nowrap overflow-hidden">
        SpendSplit
      </span>
    </Link>
  );
};
