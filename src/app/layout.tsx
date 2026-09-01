import type { Metadata } from "next";
import { helvetica } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faizah Creative Archive",
  description: "Creative Professional Portfolio — Branding, Design, Creative Direction",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${helvetica.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
