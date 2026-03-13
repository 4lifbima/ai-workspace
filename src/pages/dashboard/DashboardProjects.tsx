import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Project, supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function DashboardProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
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
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error('Gagal memuat data project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus project ini?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)
          .eq('user_id', user?.id); // Extra security check
        if (error) throw error;
        toast.success('Project berhasil dihapus');
        fetchProjects();
      } catch (error: any) {
        toast.error('Gagal menghapus project');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Manajemen Project</h1>
          <p className="text-slate-500">Kelola portofolio project AI Studio Anda di sini.</p>
        </div>
        <Link
          to="/dashboard/projects/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <Icon icon="heroicons:plus-circle" className="w-5 h-5" />
          Tambah Project Baru
        </Link>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-sm font-semibold">
                <th className="p-4 w-16 text-center">No</th>
                <th className="p-4 w-24">Gambar</th>
                <th className="p-4">Judul Project</th>
                <th className="p-4 w-32">Kategori</th>
                <th className="p-4 w-24 text-center">Link</th>
                <th className="p-4 w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <Icon icon="line-md:loading-loop" className="w-8 h-8 text-primary mx-auto" />
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon icon="heroicons:folder-open" className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">Belum ada project yang ditambahkan.</p>
                  </td>
                </tr>
              ) : (
                projects.map((project, index) => (
                  <tr key={project.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 text-center text-slate-500 font-medium">{index + 1}</td>
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
                        {project.gambar_url ? (
                          <img src={project.gambar_url} alt={project.judul} className="w-full h-full object-cover" />
                        ) : (
                          <Icon icon="heroicons:photo" className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <h4 className="font-semibold text-slate-900 line-clamp-1">{project.judul}</h4>
                      <p className="text-sm text-slate-500 line-clamp-1">{project.deskripsi_singkat || 'Tidak ada deskripsi'}</p>
                    </td>
                    <td className="p-4">
                      {project.project_categories ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {(project.project_categories as any).name}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <a
                        href={project.link_project}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Buka Link"
                      >
                        <Icon icon="heroicons:link" className="w-5 h-5" />
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/dashboard/projects/${project.id}/edit`}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Icon icon="heroicons:pencil-square" className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Icon icon="heroicons:trash" className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
