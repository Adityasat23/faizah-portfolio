"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0 });

  useEffect(() => {
    async function fetchStats() {
      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });
      
      if (count !== null) setStats({ projects: count });
    }
    fetchStats();
  }, []);

  return (
    <div>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome to the Faizah Creative Archive CMS.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>Add New Project</Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total Projects</h2>
          <p className="text-5xl font-bold">{stats.projects}</p>
        </div>
      </div>
    </div>
  );
}
