import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Project, supabase } from '../lib/supabase';
import ProjectCard from '../components/ProjectCard';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Lines Pattern */}
        <svg className="absolute w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)"></rect>
        </svg>
        
        {/* Smooth Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-[100px] mix-blend-multiply animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-gradient-to-bl from-blue-500/20 to-emerald-500/20 blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-pink-500/20 to-primary/20 blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6 text-sm font-medium text-slate-600">
            <Icon icon="heroicons:sparkles" className="w-4 h-4 text-primary" />
            <span>Showcase Your AI Creations</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
            My Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#9F7AEA]">Workspace</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            A curated gallery of AI Studio projects. Explore the possibilities of generative AI through these interactive applications.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 animate-pulse">
                <div className="aspect-video bg-slate-200 w-full" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded-lg w-full" />
                    <div className="h-4 bg-slate-200 rounded-lg w-5/6" />
                  </div>
                  <div className="h-5 bg-slate-200 rounded-lg w-1/3 mt-6" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 bg-white/50 backdrop-blur-xl rounded-[32px] border border-slate-200/50 shadow-sm animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Icon icon="heroicons:folder-open" className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No Projects Yet</h3>
            <p className="text-slate-500 text-lg">The gallery is currently empty. Check back later for new creations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
