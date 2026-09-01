import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { siteConfig } from "@/lib/siteConfig";

interface ProjectCardProps {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
}

export function ProjectCard({ id, title, subtitle, image }: ProjectCardProps) {
  const displayImage = image || siteConfig.defaultProjectImage;

  return (
    <Link href={`/works/${id}`} className="group block">
      <motion.div
        whileHover="hover"
        className="relative overflow-hidden rounded-3xl aspect-[4/5] md:aspect-square bg-[#DCD2EC] border border-[#432016]/10"
      >
        <img
          src={displayImage}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Persistent Title Overlay (Bottom Left) */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 pt-24 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-between z-10">
          <div className="text-white">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 flex items-center gap-3">
              {title} <span className="text-xl md:text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </h3>
            {subtitle && <p className="font-light text-white/80 text-sm md:text-base">{subtitle}</p>}
          </div>
        </div>

        {/* Hover Center CTA effect */}
        <motion.div
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1 }
          }}
          initial="initial"
          className="absolute inset-0 bg-[#432016]/40 flex items-center justify-center backdrop-blur-sm transition-opacity duration-500 z-20"
        >
          <Button variant="secondary" className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 bg-[#FFFFAD] text-[#432016]">
            View Work
          </Button>
        </motion.div>
      </motion.div>
    </Link>
  );
}
