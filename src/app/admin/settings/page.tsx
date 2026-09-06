"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const settingsSchema = z.object({
  hero_text: z.string().optional(),
  about_text: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  is_available_for_work: z.boolean(),
  theme: z.string().optional(),
  hero_image_radius: z.string().optional(),
  hero_container_radius: z.string().optional(),
  hero_image_padding: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentHeroImage, setCurrentHeroImage] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();
      if (data) {
        reset({
          hero_text: data.hero_text || "",
          about_text: data.about_text || "",
          email: data.email || "",
          linkedin_url: data.linkedin_url || "",
          is_available_for_work: data.is_available_for_work !== false,
          theme: data.theme || "light",
          hero_container_radius: data.hero_container_radius || "rounded-[3rem]",
          hero_image_radius: data.hero_image_radius || "rounded-[1.5rem]",
          hero_image_padding: data.hero_image_padding || "p-0",
        });
        setCurrentHeroImage(data.hero_image_url || null);
      }
      setFetching(false);
    }
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsFormValues) => {
    setLoading(true);
    setSuccessMessage("");
    
    let uploadedImageUrl = currentHeroImage;

    // Handle hero image upload
    if (imageFile) {
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `hero_${Math.random()}.${fileExt}`;
        const filePath = `settings/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio_images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('portfolio_images')
          .getPublicUrl(filePath);

        uploadedImageUrl = publicUrlData.publicUrl;
      } catch (err: any) {
        alert("Image upload failed: " + err.message);
        setLoading(false);
        return;
      }
    }
    
    const { data: existingSettings } = await supabase.from("site_settings").select("id").limit(1).single();
    
    const payload = {
      hero_text: data.hero_text,
      about_text: data.about_text,
      email: data.email,
      linkedin_url: data.linkedin_url,
      is_available_for_work: data.is_available_for_work,
      hero_image_url: uploadedImageUrl,
      theme: data.theme,
      hero_container_radius: data.hero_container_radius,
      hero_image_radius: data.hero_image_radius,
      hero_image_padding: data.hero_image_padding,
      updated_at: new Date().toISOString()
    };

    if (existingSettings) {
      const { error: updateError } = await supabase
        .from("site_settings")
        .update(payload)
        .eq("id", existingSettings.id);
        
      if (updateError) {
        alert("Database error: " + updateError.message + " (Did you run the SQL script?)");
      } else {
        setSuccessMessage("Settings updated successfully!");
        setCurrentHeroImage(uploadedImageUrl);
      }
    } else {
      const { error: insertError } = await supabase.from("site_settings").insert(payload);
      if (insertError) {
        alert("Database error: " + insertError.message);
      } else {
        setSuccessMessage("Settings created successfully!");
        setCurrentHeroImage(uploadedImageUrl);
      }
    }
    setLoading(false);
  };

  if (fetching) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-gray-500 mt-2">Manage global text, images, and links.</p>
      </header>

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm font-medium">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-secondary p-8 rounded-2xl border border-gray-200 shadow-sm">
        
        {/* AVAILABILITY TOGGLE */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <label className="flex items-center space-x-3 text-sm font-bold text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              {...register("is_available_for_work")} 
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
            />
            <span>Open for Work (Shows badge in footer)</span>
          </label>
        </div>

        {/* THEME SELECTION */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Global Theme</label>
          <select 
            {...register("theme")} 
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="light">Light Theme (Cream & Brown)</option>
            <option value="dark">Dark Theme (Dark Brown & Pink)</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">Pilih tema keseluruhan website (sesuai brief).</p>
        </div>

        {/* HERO IMAGE CUSTOMIZATION */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-700 border-b border-gray-200 pb-2">Hero Image Styling (PDF Hal 12)</h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Border Radius (Box Luar - Kuning)</label>
            <select 
              {...register("hero_container_radius")} 
              className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="rounded-none">Kotak Tajam (0px)</option>
              <option value="rounded-[1.5rem]">Rounded Normal (24px)</option>
              <option value="rounded-[3rem]">Rounded Besar (48px - Default)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Border Radius (Box Dalam - Foto)</label>
            <select 
              {...register("hero_image_radius")} 
              className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="rounded-none">Kotak (0px)</option>
              <option value="rounded-[1rem]">Rounded Normal (16px)</option>
              <option value="rounded-[1.5rem]">Rounded Besar (24px)</option>
              <option value="rounded-full">Pill / Lingkaran</option>
              <option value="rounded-l-[2rem]">Hanya Kiri Rounded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Image Padding (Margin dalam)</label>
            <select 
              {...register("hero_image_padding")} 
              className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="p-0">Tanpa Margin (Full/0px)</option>
              <option value="p-2 md:p-4">Margin Kecil</option>
              <option value="p-6 md:p-8">Margin Sedang</option>
              <option value="p-10 md:p-12">Margin Besar</option>
            </select>
          </div>
        </div>

        {/* HERO IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Hero Image (Homepage Portrait)</label>
          {currentHeroImage && (
            <div className="mb-4">
              <img src={currentHeroImage} alt="Current Hero" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
            </div>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-main file:text-accent-dark hover:file:bg-main/80"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Hero Text (Main Homepage Headline)</label>
          <textarea 
            {...register("hero_text")} 
            rows={3}
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-gray-500 mt-2">Ketik <code>*kata*</code> untuk membuat teks menjadi <i>italic</i>.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">About Text (Paragraph below photo)</label>
          <textarea 
            {...register("about_text")} 
            rows={5}
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email</label>
          <input 
            {...register("email")} 
            type="email"
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn URL</label>
          <input 
            {...register("linkedin_url")} 
            type="url"
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.linkedin_url && <p className="text-red-500 text-sm mt-1">{errors.linkedin_url.message}</p>}
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
