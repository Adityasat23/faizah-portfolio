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
  is_available_for_work: z.boolean().default(true),
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
          is_available_for_work: data.is_available_for_work !== false, // default true
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        
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

        {/* HERO IMAGE */}
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
            className="w-full border-gray-300 border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#DCD2EC] file:text-[#432016] hover:file:bg-[#DCD2EC]/80"
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
