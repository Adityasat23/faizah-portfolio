"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";
import { supabase } from "@/lib/supabase";

export function Footer() {
  const [links, setLinks] = useState({
    email: siteConfig.email,
    linkedin: siteConfig.linkedin
  });
  
  // Placeholder for is_available_for_work (Phase 1)
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('email, linkedin_url, is_available_for_work').limit(1).single();
      if (data) {
        setLinks(prev => ({
          email: data.email || prev.email,
          linkedin: data.linkedin_url || prev.linkedin
        }));
        if (data.is_available_for_work !== undefined) {
          setIsAvailable(data.is_available_for_work);
        }
      }
    }
    fetchSettings();
  }, []);
  return (
    <footer className="bg-secondary text-accent-dark pt-12 pb-8 border-t border-accent-dark/10" id="contact">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col lg:flex-row gap-16 mb-24 items-center">
          {/* Left Column: Form */}
          <div className="w-full lg:w-1/2 bg-main p-8 md:p-12 rounded-[2rem]">
            <h3 className="text-3xl font-bold mb-8 text-accent-dark">Get in Touch!</h3>
            <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="w-full bg-transparent border-b-2 border-accent-dark px-2 py-4 text-xl focus:outline-none placeholder-accent-dark/40 text-accent-dark" required />
              <button type="submit" className="absolute right-0 text-3xl font-bold p-2 text-accent-dark hover:translate-x-2 transition-transform">
                →
              </button>
            </form>
          </div>

          {/* Right Column: Prior Experience and Links */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="mb-12">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tighter text-accent-dark mb-4 uppercase">
                Prior Experience
              </h3>
              <div className="text-xl md:text-2xl font-light text-accent-dark leading-relaxed">
                Time Phoria | Eze Nails | Xiaomi | Kata.ai | MNC Group | Fulfil Studio
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Link href={links.linkedin} target="_blank" className="text-xl md:text-2xl font-bold text-accent-dark hover:text-accent-pink transition-colors">
                  {links.linkedin.replace('https://www.', '').replace('https://', '')}
                </Link>
              </div>
              <div>
                <Link href={`mailto:${links.email}`} className="text-xl md:text-2xl font-bold text-accent-dark hover:text-accent-pink transition-colors">
                  {links.email}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between text-xs font-bold pt-8 border-t border-accent-dark/20">
          <div className="text-accent-dark mb-4 md:mb-0">
            <p className="mb-2">Strictly Confidential, shared recruitment purposes only</p>
            <div className="flex items-center gap-2">
              <p>Faizah Amrina Creative Showcase &copy; {new Date().getFullYear()}</p>
              <span>•</span>
              <Link href="/admin" className="hover:text-accent-pink transition-colors underline underline-offset-2">Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
