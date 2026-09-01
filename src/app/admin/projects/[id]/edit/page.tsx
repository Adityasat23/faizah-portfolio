"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm as useHookForm } from "react-hook-form";

const CATEGORY_OPTIONS = [
  "Creative Direction",
  "Asset Production",
  "Branding Strategy",
  "Creative & Content Writing",
  "Conceptual Launching",
  "Graphic Design"
];

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  what_we_did: z.string().optional(),
  category_tags: z.array(z.string()),
  video_url: z.string().optional(),
  is_published: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useHookForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      category_tags: [],
    }
  });

  const selectedCategories = watch("category_tags") || [];

  const handleCategoryToggle = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setValue("category_tags", selectedCategories.filter(c => c !== cat));
    } else {
      setValue("category_tags", [...selectedCategories, cat]);
    }
  };

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
      if (error) {
        setError(error.message);
      } else if (data) {
        // Handle media jsonb
        let mediaArr = data.media || [];
        if (mediaArr.length === 0 && data.images && data.images.length > 0) {
          // Fallback if not migrated yet
          const isVideoUrl = (url: string) => url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('tiktok.com');
          mediaArr = data.images.map((url: string, i: number) => ({
            type: isVideoUrl(url) ? "video_embed" : "image",
            url: url,
            order: i
          }));
        }

        const videoObj = mediaArr.find((m: any) => m.type === "video_embed");
        const videoUrl = videoObj ? videoObj.url : "";
        
        // Keep existing images (as json objects)
        setExistingImages(mediaArr.filter((m: any) => m.type === "image"));
        
        reset({
          title: data.title,
          subtitle: data.subtitle || "",
          description: data.description || "",
          what_we_did: data.what_we_did ? data.what_we_did.join(", ") : "",
          category_tags: data.category_tags || data.scope_of_work || [],
          video_url: videoUrl,
          is_published: data.is_published ?? true,
        });
      }
      setInitialLoading(false);
    }
    fetchProject();
  }, [id, reset]);

  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true);
    setError("");

    try {
      // 1. Upload Images to Storage
      const finalMedia: any[] = [...existingImages]; // Keep old images
      
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio_images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('portfolio_images')
          .getPublicUrl(filePath);

        finalMedia.push({
          type: "image",
          url: publicUrlData.publicUrl,
          order: finalMedia.length
        });
      }

      // If user provides a video URL, add it to the media array
      if (data.video_url) {
        let provider = "other";
        if (data.video_url.includes("youtube") || data.video_url.includes("youtu.be")) provider = "youtube";
        else if (data.video_url.includes("vimeo")) provider = "vimeo";
        else if (data.video_url.includes("tiktok")) provider = "tiktok";
        else if (data.video_url.includes("drive.google")) provider = "gdrive";
        else if (data.video_url.includes("instagram")) provider = "instagram";

        // Remove old video embed if any exists to replace it, or just add it
        const videoIdx = finalMedia.findIndex(m => m.type === "video_embed");
        const newVideoObj = {
          type: "video_embed",
          url: data.video_url,
          provider: provider,
          order: videoIdx >= 0 ? videoIdx : finalMedia.length
        };
        
        if (videoIdx >= 0) {
          finalMedia[videoIdx] = newVideoObj;
        } else {
          finalMedia.push(newVideoObj);
        }
      } else {
        // If empty string, remove existing video
        const videoIdx = finalMedia.findIndex(m => m.type === "video_embed");
        if (videoIdx >= 0) finalMedia.splice(videoIdx, 1);
      }

      // 2. Update Database
      const { error: updateError } = await supabase.from("projects").update({
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        what_we_did: data.what_we_did ? data.what_we_did.split(",").map(s => s.trim()) : [],
        scope_of_work: data.category_tags, // fallback for older code
        category_tags: data.category_tags,
        media: finalMedia,
        images: finalMedia.map((m: any) => m.url), // fallback string array
        is_published: data.is_published
      }).eq("id", id);

      if (updateError) throw updateError;
      
      router.push("/admin/projects");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-8">Loading project details...</div>;

  return (
    <div className="max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
          <input 
            {...register("title")} 
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle</label>
          <input 
            {...register("subtitle")} 
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
          <textarea 
            {...register("description")} 
            rows={5}
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* IMAGE UPLOAD FIELD */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Upload More Images</label>
          {existingImages.length > 0 && (
            <p className="text-xs text-gray-500 mb-2">Currently has {existingImages.length} images.</p>
          )}
          <input 
            type="file" 
            multiple
            accept="image/*"
            onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#DCD2EC] file:text-[#432016] hover:file:bg-[#DCD2EC]/80"
          />
        </div>

        {/* EMBED VIDEO LINK */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Embed Link (Optional)</label>
          <input 
            {...register("video_url")} 
            placeholder="e.g. YouTube, TikTok, Instagram, or Google Drive link"
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-gray-500 mt-2">Paste a link to embed media instead of uploading an image.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">What We Did (comma separated)</label>
          <input 
            {...register("what_we_did")} 
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g. Brand Strategy, Visual Identity, Packaging"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Categories</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CATEGORY_OPTIONS.map((cat) => (
              <label key={cat} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-900">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mt-6">
          <label className="flex items-center space-x-3 text-sm font-bold text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              {...register("is_published")} 
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
            />
            <span>Publish to Website (Visible to Public)</span>
          </label>
          <p className="text-xs text-gray-500 mt-2 ml-8">If unchecked, this project will be saved as a Draft.</p>
        </div>

        <div className="pt-4 border-t border-gray-200 flex items-center space-x-4 mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Project"}
          </Button>
          <button type="button" onClick={() => router.back()} className="text-sm font-bold text-gray-500 hover:text-black uppercase tracking-widest">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
