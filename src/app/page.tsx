"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/siteConfig";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    hero_text: "",
    about_text: "",
    hero_image_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch settings
        const { data: settingsData, error: settingsError } = await supabase.from('site_settings').select('*').limit(1).single();
        console.log("Fetched Settings:", settingsData, "Error:", settingsError);
        
        if (settingsError) {
          console.error("Settings Error:", settingsError);
          setFetchError(settingsError.message);
        }

        if (settingsData) {
          setSettings({
            hero_text: settingsData.hero_text || "Faizah *she/her* is an independent creative director and designer who builds brands that resonate.",
            about_text: settingsData.about_text || "Creative professional specializing in branding, design, and creative direction.",
            hero_image_url: settingsData.hero_image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop"
          });
        }

        // Fetch projects (Featured only for homepage)
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (projectsError) {
          console.error("Projects Error:", projectsError);
          setFetchError(projectsError.message);
        }

        if (projectsData) setProjects(projectsData);
      } catch (err: any) {
        console.error("Unexpected Error:", err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Helper to parse *text* into italic spans
  const renderFormattedText = (text: string, italicClassName: string) => {
    if (!text) return null;
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <span key={i} className={italicClassName}>{part.slice(1, -1)}</span>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <>
      <Navbar />
      
      <main className="bg-[#DCD2EC] min-h-screen pt-24 md:pt-32 pb-6 px-4 md:px-6">
        {fetchError && (
          <div className="container mx-auto mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error Loading Data: </strong>
            <span className="block sm:inline">{fetchError}</span>
          </div>
        )}

        {/* HERO / MEET FAIZAH SECTION */}
        <section id="about" className="min-h-[90vh] bg-[#F4F2EE] rounded-[3rem] p-6 md:p-12 mb-6 flex flex-col justify-center border border-[#432016]/5 shadow-sm relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10">
            {loading ? (
              <div className="animate-pulse flex flex-col space-y-12">
                <div className="h-24 md:h-48 bg-[#432016]/10 rounded-3xl w-3/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="aspect-square md:aspect-auto md:h-[60vh] bg-[#432016]/10 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl"></div>
                  <div className="bg-[#432016]/5 p-8 md:p-12 rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl"></div>
                </div>
              </div>
            ) : (
              <>
                <motion.h1 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="text-[12vw] md:text-[9vw] font-bold tracking-tighter leading-[0.9] text-[#432016] mb-12 uppercase"
                >
                  {renderFormattedText(settings.hero_text, "italic font-light lowercase")}
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-0 border-y border-[#432016]/10">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    className="aspect-[4/5] bg-[#FFFFAD] md:border-r border-[#432016]/10 p-4 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl"
                  >
                    <img 
                      src={settings.hero_image_url} 
                      alt="Portrait of Faizah"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                    className="bg-[#FFFFAD] p-8 md:p-12 flex flex-col justify-center rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl"
                  >
                    <p className="text-xl md:text-3xl font-light leading-relaxed text-[#432016] tracking-tight whitespace-pre-wrap">
                      {renderFormattedText(settings.about_text, "italic")}
                    </p>
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* BODY / SHOWCASED WORKS */}
        <section className="py-24 px-6 md:px-12 bg-white rounded-[3rem] border border-[#432016]/5 shadow-sm">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <motion.h2 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 100 }}
                className="text-6xl md:text-[7vw] font-bold tracking-tighter text-[#432016] leading-[0.9] max-w-4xl uppercase"
              >
                Selected <span className="italic font-light lowercase">Works</span>
              </motion.h2>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="bg-[#FFC5E6] text-[#432016] px-6 py-3 rounded-full text-xl md:text-3xl font-bold whitespace-nowrap self-start md:self-end"
              >
                From <span className="italic font-light">Vision</span> to <span className="italic font-light">Reality</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-2xl md:text-4xl text-[#432016] font-light max-w-3xl leading-tight"
            >
              I believe in making work that works <span className="italic font-normal">IRL</span> and in the scroll.
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex gap-4 mb-16 overflow-x-auto pb-4 hide-scrollbar"
            >
              {['Creative Direction', 'Asset Production', 'Branding Strategy', 'Creative & Content Writing', 'Conceptual Launching', 'Graphic Design'].map((tag, idx) => (
                <div key={tag} className="flex-shrink-0 flex items-center bg-[#F4F2EE] px-5 py-3 rounded-2xl border border-[#432016]/10">
                  <span className="text-sm uppercase tracking-widest font-bold text-[#432016]">
                    {tag}
                  </span>
                </div>
              ))}
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              {loading ? (
                <div className="col-span-2 text-center py-20 text-[#432016]">Loading projects...</div>
              ) : projects.length > 0 ? (
                projects.map((p, i) => {
                  let thumbUrl = siteConfig.defaultProjectImage;
                  if (p.media && p.media.length > 0) {
                    const firstImg = p.media.find((m: any) => m.type === "image");
                    if (firstImg) thumbUrl = firstImg.url;
                  } else if (p.images && p.images.length > 0) {
                    thumbUrl = p.images[0]; // fallback
                  }

                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ type: "spring", stiffness: 100, delay: i * 0.1 }}
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
                <div className="col-span-2 text-center py-20 border border-dashed border-[#432016]/20 rounded-3xl">
                  <p className="text-[#432016]/70 mb-4">No projects yet.</p>
                  <Link href="/admin/projects/new">
                    <Button className="bg-[#432016] text-[#DCD2EC] hover:bg-black rounded-full px-8">Add your first project in Admin</Button>
                  </Link>
                </div>
              )}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-24 flex justify-center"
            >
              <Link href="/works">
                <Button className="bg-transparent text-[#432016] border-2 border-[#432016] hover:bg-[#432016] hover:text-[#DCD2EC] rounded-full px-12 py-8 text-xl tracking-tighter uppercase font-bold">
                  View The Archive
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
