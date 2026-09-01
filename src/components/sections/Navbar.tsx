"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [links, setLinks] = useState({
    email: siteConfig.email,
    linkedin: siteConfig.linkedin
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('email, linkedin_url').limit(1).single();
      if (data) {
        setLinks(prev => ({
          email: data.email || prev.email,
          linkedin: data.linkedin_url || prev.linkedin
        }));
      }
    }
    fetchSettings();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 20);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-[#432016]/10 ${
        isScrolled ? "bg-[#DCD2EC]/60 backdrop-blur-2xl" : "bg-[#DCD2EC]"
      }`}
    >
      <div className="flex items-center justify-between text-[#432016]">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight px-6 py-4 md:px-12 border-r border-[#432016]/20 flex-shrink-0">
          FAIZAH
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center h-full">
          <Link href="/#about" className="px-6 py-4 text-sm uppercase tracking-widest font-bold hover:bg-[#432016]/5 transition-colors border-r border-[#432016]/20">
            About
          </Link>
          <Link href="/works" className="px-6 py-4 text-sm uppercase tracking-widest font-bold hover:bg-[#432016]/5 transition-colors border-r border-[#432016]/20">
            Curated Works
          </Link>
          <Link href="/#contact" className="px-6 py-4 text-sm uppercase tracking-widest font-bold hover:bg-[#432016]/5 transition-colors border-r border-[#432016]/20">
            Get in Touch
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center border-l border-[#432016]/20 h-full">
          <Link href={`mailto:${links.email}`} className="px-6 py-4 hover:bg-[#432016]/5 transition-colors border-r border-[#432016]/20 flex items-center justify-center">
            <Mail size={20} />
          </Link>
          <Link href={links.linkedin} target="_blank" rel="noopener noreferrer" className="px-6 py-4 hover:bg-[#432016]/5 transition-colors flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
