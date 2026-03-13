import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Project } from '../lib/supabase';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0 }) => {
  const [imgError, setImgError] = useState(false);
  const staggerClass = `stagger-${(index % 4) + 1}`;

  return (
    <div className={`bg-white rounded-[24px] overflow-hidden project-card-shadow hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full group animate-fade-in opacity-0 ${staggerClass}`}>
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        {!imgError && project.gambar_url ? (
          <img
            src={project.gambar_url}
            alt={project.judul}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <Icon icon="heroicons:photo" className="w-16 h-16 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="p-6 sm:p-8 flex flex-col flex-grow relative bg-white/80 backdrop-blur-xl">
        {project.project_categories && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {(project.project_categories as any).name}
            </span>
          </div>
        )}
        <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">{project.judul}</h3>
        <p className="text-slate-500 text-sm sm:text-slate-600 mb-8 flex-grow line-clamp-3 leading-relaxed">
          {project.deskripsi_singkat}
        </p>
        
        <a
          href={project.link_project}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-semibold group/btn w-fit"
        >
          <span className="relative">
            Lihat Project
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover/btn:w-full"></span>
          </span>
          <Icon icon="heroicons:arrow-top-right-on-square" className="w-5 h-5 transition-transform duration-300 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
