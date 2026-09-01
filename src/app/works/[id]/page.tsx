"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [otherProjects, setOtherProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      // Fetch current project
      const { data: currentProject } = await supabase.from('projects').select('*').eq('id', id).single();
      if (currentProject) {
        setProject(currentProject);
      }
      
      // Fetch other projects
      const { data: others } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(2);
      if (others) {
        setOtherProjects(others);
      }

      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F2EE] text-[#432016]">
        Loading...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F2EE] text-[#432016]">
        Project not found.
      </div>
    );
  }

  // Helper to check if a URL is an embed (not a direct image)
  const isEmbedUrl = (url: string) => {
    if (!url) return false;
    // If it's uploaded to our Supabase, it's an image
    if (url.includes('supabase.co/storage')) return false;
    
    // If it's a direct link to an image file
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/)) {
      return false;
    }
    
    // Otherwise, treat as an embed link
    return true;
  };

  // Helper to convert standard links to their embed equivalents
  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/').split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
    }
    
    // Vimeo
    if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
      return url.replace('vimeo.com/', 'player.vimeo.com/video/');
    }

    // TikTok
    if (url.includes('tiktok.com')) {
      const match = url.match(/video\/(\d+)/);
      if (match) {
        return `https://www.tiktok.com/embed/v2/${match[1]}`;
      }
    }

    // Instagram
    if (url.includes('instagram.com')) {
      let base = url.split('?')[0];
      if (!base.endsWith('/')) base += '/';
      if (!base.endsWith('embed/')) base += 'embed';
      return base;
    }

    // Google Drive
    if (url.includes('drive.google.com/file/d/')) {
      return url.replace(/\/view.*$/, '/preview');
    }

    // Any other link (Spotify, Figma, generic websites, etc.)
    return url;
  };

  // Media processing
  let imageAssets: string[] = [];
  let videoAssets: any[] = [];
  
  if (project.media && project.media.length > 0) {
    imageAssets = project.media.filter((m: any) => m.type === "image").map((m: any) => m.url);
    videoAssets = project.media.filter((m: any) => m.type === "video_embed");
  } else if (project.images && project.images.length > 0) {
    // Fallback for older projects that haven't been migrated
    imageAssets = project.images.filter((img: string) => !isEmbedUrl(img));
    videoAssets = project.images.filter((img: string) => isEmbedUrl(img)).map((url: string) => ({
      type: "video_embed",
      url: url,
      provider: "unknown"
    }));
  }

  return (
    <>
      <Navbar />
      
      <main className="pt-32 pb-20 min-h-screen bg-[#F4F2EE]">
        <article className="container mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
            {/* Left side: Project Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 space-y-8"
            >
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-[#FFC5E6] bg-[#432016] inline-block px-4 py-2 leading-none">
                {project.title}
              </h1>
              <div className="border border-[#432016]/20 p-8 md:p-12 bg-white">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#432016] mb-8 leading-[1.1]">
                  {project.subtitle}
                </h2>
                <p className="text-sm md:text-base font-light leading-relaxed text-[#432016]/80 whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </motion.div>

            {/* Right side: Sidebar info */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 space-y-8"
            >
              {/* Scope of Work / Categories */}
              {((project.category_tags && project.category_tags.length > 0) || (project.scope_of_work && project.scope_of_work.length > 0)) && (
                <div>
                  <h3 className="text-[#FFC5E6] bg-[#432016] inline-block px-3 py-1 font-bold tracking-tighter text-2xl mb-2">Scope of Work</h3>
                  <ul className="text-2xl font-light text-[#432016] leading-snug">
                    {(project.category_tags && project.category_tags.length > 0 ? project.category_tags : project.scope_of_work).map((item: string) => (
                      <li key={item} className="mb-1">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What We Did Box */}
              {project.what_we_did && project.what_we_did.length > 0 && (
                <div className="border border-[#432016]/20 p-6 bg-white">
                  <h3 className="font-bold text-[#432016] mb-4">What We Did:</h3>
                  <ul className="space-y-2 text-xs font-bold text-[#432016]/80 tracking-wide uppercase">
                    {project.what_we_did.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>

          {/* Project Media */}
          {(imageAssets.length > 0 || videoAssets.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-32 items-start">
              {/* Render Images */}
              {imageAssets.map((img: string, idx: number) => (
                <motion.div 
                  key={`img-${idx}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="w-full bg-[#DCD2EC] overflow-hidden rounded-3xl border border-[#432016]/10"
                >
                  <img src={img} alt={`Project media ${idx + 1}`} className="w-full h-auto object-cover" />
                </motion.div>
              ))}
              
              {/* Render Videos */}
              {videoAssets.map((videoObj: any, idx: number) => {
                const videoUrl = videoObj.url;
                const isVertical = videoUrl.includes('tiktok.com') || videoUrl.includes('instagram.com') || videoObj.provider === 'tiktok' || videoObj.provider === 'instagram';
                const aspectClass = isVertical ? 'aspect-[9/16] md:aspect-[4/5]' : 'aspect-video';

                return (
                  <motion.div 
                    key={`vid-${idx}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    className={`w-full bg-[#DCD2EC] border border-[#432016]/10 ${aspectClass} flex items-center justify-center overflow-hidden relative rounded-3xl`}
                  >
                    <iframe 
                      className="absolute inset-0 w-full h-full"
                      src={getEmbedUrl(videoUrl)}
                      title="Embedded Video Presentation"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Other Work Section */}
          {otherProjects.length > 0 && (
            <div className="border-t border-[#432016]/20 pt-16">
              <h2 className="text-center text-4xl font-bold tracking-tighter text-[#432016] mb-12 uppercase">Other Work</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {otherProjects.map((p) => (
                 <Link href={`/works/${p.id}`} key={p.id} className="group cursor-pointer">
                   <div className="aspect-[4/3] bg-[#DCD2EC] mb-4 overflow-hidden border border-[#432016]/10">
                     <img src={p.images?.[0] || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2564&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.title}/>
                   </div>
                   <h4 className="font-bold text-xl text-[#432016] group-hover:underline underline-offset-4">{p.title}</h4>
                 </Link>
                ))}
              </div>
            </div>
          )}
          
        </article>
      </main>

      <Footer />
    </>
  );
}
