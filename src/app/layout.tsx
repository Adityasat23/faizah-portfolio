import type { Metadata } from "next";
import { helvetica } from "@/lib/fonts";
import "./globals.css";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Faizah Creative Archive",
  description: "Creative Professional Portfolio — Branding, Design, Creative Direction",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let theme = "light";
  try {
    const { data } = await supabase.from("site_settings").select("theme").limit(1).single();
    if (data && data.theme) {
      theme = data.theme;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <html
      lang="en"
      className={`${helvetica.variable} font-sans h-full antialiased`}
      data-theme={theme}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
