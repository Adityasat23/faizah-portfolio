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
    <footer className="bg-[#432016] text-[#DCD2EC] pt-24 pb-8" id="contact">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Contact Section (Like the provided reference, but moodboard styled) */}
        <div className="flex flex-col lg:flex-row gap-16 mb-24 border-b border-[#DCD2EC]/20 pb-16">
          {/* Left Column: Let's work together */}
          <div className="lg:w-1/2">
            {isAvailable && (
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#FFC5E6]/30 rounded-full text-[#FFC5E6] text-xs font-bold tracking-widest uppercase mb-8">
                <span className="w-2 h-2 rounded-full bg-[#FFC5E6] animate-pulse"></span>
                Open for work
              </div>
            )}
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-[#FFC5E6] leading-[1.1]">
              Let's work together — <br/>I'm available for freelance projects.
            </h2>
            
            <div className="space-y-4">
              <Link href={`mailto:${links.email}`} className="flex items-center justify-between p-6 border border-[#DCD2EC]/20 rounded-2xl hover:bg-[#DCD2EC]/5 transition-colors group">
                <div>
                  <h3 className="font-bold text-xl text-white mb-1">Email</h3>
                  <p className="font-light text-sm opacity-70">{links.email}</p>
                </div>
                <span className="text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
              </Link>
              
              <Link href={links.linkedin} target="_blank" className="flex items-center justify-between p-6 border border-[#DCD2EC]/20 rounded-2xl hover:bg-[#DCD2EC]/5 transition-colors group">
                <div>
                  <h3 className="font-bold text-xl text-white mb-1">LinkedIn</h3>
                  <p className="font-light text-sm opacity-70">Professional network & updates</p>
                </div>
                <span className="text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:w-1/2 bg-[#DCD2EC] text-[#432016] p-8 md:p-12 rounded-3xl flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Get in Touch!</h3>
            <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="w-full bg-transparent border-b-2 border-[#432016] px-2 py-4 text-xl focus:outline-none placeholder-[#432016]/40" required />
              <button type="submit" className="absolute right-0 text-3xl font-bold p-2 hover:translate-x-2 transition-transform">
                →
              </button>
            </form>
          </div>
        </div>

        {/* Links and Marquee */}
        <div className="flex flex-col lg:flex-row justify-between mb-16 gap-12">
          {/* Sitemap structured perfectly */}
          <div className="lg:w-1/3">
            <h3 className="mb-6 text-[#DCD2EC] font-bold tracking-widest uppercase text-xl">Site Map</h3>
            <ul className="space-y-4 text-sm font-bold tracking-widest uppercase">
              <li><Link href="/#about" className="text-[#FFC5E6] hover:text-white underline underline-offset-4 decoration-1">About</Link></li>
              <li><Link href="/works" className="text-[#FFC5E6] hover:text-white underline underline-offset-4 decoration-1">Projects</Link></li>
              <li><Link href="/#contact" className="text-[#FFC5E6] hover:text-white underline underline-offset-4 decoration-1">Contact</Link></li>
            </ul>
          </div>

          {/* Prior Experience Marquee */}
          <div className="lg:w-2/3 overflow-hidden">
            <h3 className="mb-6 text-[#DCD2EC] font-bold tracking-widest uppercase text-xl border-b border-[#DCD2EC]/20 pb-4">Prior Experience</h3>
            <div className="flex whitespace-nowrap opacity-70 mt-6">
              <motion.div
                className="flex items-center space-x-12 text-2xl font-light"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              >
                {[...Array(2)].map((_, i) => (
                  <React.Fragment key={i}>
                    <span>Time Phoria</span><span className="text-[#FFC5E6]">•</span>
                    <span>Eze Nails</span><span className="text-[#FFC5E6]">•</span>
                    <span>Xiaomi</span><span className="text-[#FFC5E6]">•</span>
                    <span>Kata.ai</span><span className="text-[#FFC5E6]">•</span>
                    <span>MNC Group</span><span className="text-[#FFC5E6]">•</span>
                    <span>Fulfil Studio</span><span className="text-[#FFC5E6]">•</span>
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-center text-xs opacity-50 font-light pt-8 border-t border-[#DCD2EC]/20 space-y-2 text-center">
          <p className="text-[#FFC5E6] font-medium tracking-wide">Strictly Confidential, shared recruitment purposes only</p>
          <div className="flex items-center gap-4 justify-center">
            <p>Faizah Amrina Creative Showcase &copy; 2026</p>
            <span>•</span>
            <Link href="/admin" className="hover:text-white transition-colors underline underline-offset-2">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
