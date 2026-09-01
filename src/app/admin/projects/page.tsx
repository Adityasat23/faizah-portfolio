"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  created_at: string;
  is_published: boolean;
  is_featured: boolean;
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, subtitle, created_at, is_published, is_featured")
      .order("created_at", { ascending: false });
    
    if (data) setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  }

  async function toggleFeatured(id: string, currentStatus: boolean) {
    await supabase.from("projects").update({ is_featured: !currentStatus }).eq("id", id);
    fetchProjects();
  }

  return (
    <div>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-gray-500 mt-2">Manage your portfolio works.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>Add New Project</Button>
        </Link>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No projects found. Add one to get started.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-sm font-bold uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Featured (Home)</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.title}</td>
                  <td className="px-6 py-4">
                    {p.is_published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={p.is_featured} 
                      onChange={() => toggleFeatured(p.id, p.is_featured)}
                      className="w-5 h-5 cursor-pointer text-black border-gray-300 rounded focus:ring-black"
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <Link href={`/works/${p.id}`} target="_blank" className="text-purple-600 font-medium hover:underline">
                      Preview
                    </Link>
                    <Link href={`/admin/projects/${p.id}/edit`} className="text-blue-600 font-medium hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 font-medium hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
