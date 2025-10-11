'use client';

import React, { useState, FormEvent } from 'react';
import { Gugi } from "next/font/google";
import HomePageClient from "./HomePageClient";
import NotificationToast from "./notification-toast";
import { createClient } from "@/lib/supabase";

const gugi = Gugi({ 
  weight: "400", 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      
      // SECURITY: Insert with email validation
      const { error } = await supabase
        .from('waiting_list')
        .insert([{ email: email.toLowerCase().trim() }]);
      
      if (error) {
        // SAFETY: Handle duplicate email gracefully
        if (error.code === '23505') {
          console.log('Email already in waitlist');
        } else {
          console.error('Error adding to waitlist:', error);
        }
      }
      
      // Show success notification regardless (don't leak DB state)
      setShowNotification(true);
      setEmail('');
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${gugi.className} gugi-font overflow-hidden h-screen z-10 relative pointer-events-none bg-transparent`}>
      <NotificationToast 
        message="Added to waiting list"
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
      
      {/* Ava on top left */}
      <span className="bg-transparent z-20 absolute top-4 left-4 pointer-events-auto">
        <h1 className="text-4xl">AVA</h1>
      </span>
      
      {/* Auth-dependent navigation - client component */}
      <HomePageClient />
      
      {/* Caption above email input */}
      <span className="z-30 absolute bottom-96 left-1/3 transform -translate-x-10 pointer-events-none">
        <h1 className="text-4xl">automation that makes sense</h1>
      </span>

      <form onSubmit={handleSubmit}>
        {/* Email input in lower center */}
        <span className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 z-20 absolute bottom-48 left-1/3 transform -translate-x-10 pointer-events-auto">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="text-sm text-gray-800 px-6 py-6 bg-transparent border-none outline-none w-[45vw]" 
          />
        </span>
        
        {/* Button to bottom right of inputs */}
        <span className="z-20 absolute bottom-16 right-[34%] transform translate-x-20 pointer-events-auto">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="text-md text-white px-6 py-4 bg-[#4f4ff6] rounded-lg hover:bg-[#3333DD] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Join waiting list'}
          </button>
        </span>
      </form>
    </div>
  );
}