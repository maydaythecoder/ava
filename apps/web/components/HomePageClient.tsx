"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function HomePageClient() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // SAFETY: Prevent hydration mismatch by only rendering auth-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <span className="bg-transparent z-20 absolute top-4 right-4 flex gap-4 text-right pointer-events-auto">
      {mounted && !user && (
        <>
          <Link href="/login" className="text-md text-gray-700 hover:text-gray-900">Login</Link>
          <Link href="/signup" className="text-md text-gray-700 hover:text-gray-900">Sign up</Link>
        </>
      )}
      <Link href="/sandbox" className="text-md text-gray-700 hover:text-gray-900">Sandbox</Link>
    </span>
  );
}

