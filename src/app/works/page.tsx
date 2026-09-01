"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/siteConfig";

export default function WorksPage() {
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = ['Creative Direction', 'Asset Production', 'Branding Strategy', 'Creative & Content Writing', 'Conceptual Launching', 'Graphic Design'];

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (data) setAllProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  const filteredProjects = activeCategory
    ? allProjects.filter(p => (p.category_tags && p.category_tags.includes(activeCategory)) || (p.scope_of_work && p.scope_of_work.includes(activeCategory)))
    : allProjects;

  return (
    <>
      <Navbar />
      
      <main className="bg-white min-h-screen pt-40 pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-20">
            <h1 className="text-6xl md:text-[8vw] font-bold tracking-tighter text-[#432016] leading-[0.9] uppercase mb-8">
              The <span className="italic font-light lowercase">Archive</span>
            </h1>
            
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              <button 
                onClick={() => setActiveCategory(null)}
                className={`flex-shrink-0 flex items-center transition-colors px-5 py-3 rounded-2xl border border-[#432016]/10 ${
                  activeCategory === null ? 'bg-[#B9DBFF]' : 'bg-[#F4F2EE] hover:bg-[#DCD2EC]'
                }`}
              >
                <span className="text-sm uppercase tracking-widest font-bold text-[#432016]">
                  All Works
                </span>
              </button>

              {categories.map((tag) => (
                <button 
                  key={tag} 
                  onClick={() => setActiveCategory(tag)}
                  className={`flex-shrink-0 flex items-center transition-colors px-5 py-3 rounded-2xl border border-[#432016]/10 ${
                    activeCategory === tag ? 'bg-[#B9DBFF]' : 'bg-[#F4F2EE] hover:bg-[#DCD2EC]'
                  }`}
                >
                  <span className="text-sm uppercase tracking-widest font-bold text-[#432016]">
                    {tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {loading ? (
              <div className="col-span-full text-center py-20 text-[#432016]">Loading archive...</div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((p, i) => {
                let thumbUrl = siteConfig.defaultProjectImage;
                if (p.media && p.media.length > 0) {
                  const firstImg = p.media.find((m: any) => m.type === "image");
                  if (firstImg) thumbUrl = firstImg.url;
                } else if (p.images && p.images.length > 0) {
                  thumbUrl = p.images[0]; // fallback
                }

                return (
                  <motion.div
                    layout
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 100, delay: i * 0.05 }}
                  >
                    <ProjectCard 
                      id={p.id}
                      title={p.title}
                      subtitle={p.subtitle}
                      image={thumbUrl}
                    />
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 text-[#432016]/60 text-xl border border-dashed border-[#432016]/20 rounded-3xl">
                No archived projects found for this category.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
