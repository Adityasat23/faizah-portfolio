"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic auth check
    const checkAuth = async () => {
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // No sidebar for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="font-bold text-xl tracking-tight">FAIZAH ADMIN</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/admin" 
            className={`block px-4 py-2 rounded-lg text-sm font-medium ${pathname === "/admin" ? "bg-gray-100 text-black" : "text-gray-500 hover:text-black hover:bg-gray-50"}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/projects" 
            className={`block px-4 py-2 rounded-lg text-sm font-medium ${pathname.includes("/admin/projects") ? "bg-gray-100 text-black" : "text-gray-500 hover:text-black hover:bg-gray-50"}`}
          >
            Projects
          </Link>
          <Link 
            href="/admin/settings" 
            className={`block px-4 py-2 rounded-lg text-sm font-medium ${pathname.includes("/admin/settings") ? "bg-gray-100 text-black" : "text-gray-500 hover:text-black hover:bg-gray-50"}`}
          >
            Site Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link 
            href="/" 
            target="_blank"
            className="block w-full text-left px-4 py-2 text-sm text-[#432016] hover:bg-gray-100 rounded-lg font-medium"
          >
            View Live Site ↗
          </Link>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/admin/login");
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
