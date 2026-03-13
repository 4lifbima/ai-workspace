import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase, ProjectCategory } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  
  const [formData, setFormData] = useState({
    judul: '',
    gambar_url: '',
    link_project: '',
    deskripsi_singkat: '',
    category_id: '' as string | number,
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProject();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('project_categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Gagal memuat kategori');
    }
  };

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          judul: data.judul || '',
          gambar_url: data.gambar_url || '',
          link_project: data.link_project || '',
          deskripsi_singkat: data.deskripsi_singkat || '',
          category_id: data.category_id || '',
        });
      }
    } catch (error: any) {
      toast.error('Gagal memuat data project');
      navigate('/dashboard/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);

    try {
      const projectData = {
        ...formData,
        user_id: user.id,
        category_id: formData.category_id ? Number(formData.category_id) : null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Project berhasil diperbarui');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast.success('Project berhasil ditambahkan');
      }
      
      navigate('/dashboard/projects');
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icon icon="line-md:loading-loop" className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link to="/dashboard/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-4">
            <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
            Kembali ke Projects
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isEditing ? 'Edit Project' : 'Tambah Project Baru'}
          </h1>
          <p className="text-slate-500">
            {isEditing ? 'Perbarui informasi project Anda.' : 'Tambahkan project baru ke portofolio Anda.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Project *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="heroicons:document-text" className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    required
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 transition-all font-medium"
                    placeholder="Contoh: AI Image Generator"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="heroicons:tag" className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-10 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 transition-all font-medium appearance-none"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Icon icon="heroicons:chevron-down" className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">URL Gambar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="heroicons:photo" className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    name="gambar_url"
                    value={formData.gambar_url}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 transition-all font-medium"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Link Project *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="heroicons:link" className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    name="link_project"
                    value={formData.link_project}
                    onChange={handleChange}
                    required
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 transition-all font-medium"
                    placeholder="https://aistudio.google.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Deskripsi Singkat (Maks 200 karakter)
            </label>
            <textarea
              name="deskripsi_singkat"
              value={formData.deskripsi_singkat}
              onChange={handleChange}
              maxLength={200}
              rows={4}
              className="block w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 transition-all font-medium resize-none"
              placeholder="Deskripsikan project ini secara singkat..."
            />
            <div className="text-right text-xs text-slate-500 mt-2 font-medium">
              {formData.deskripsi_singkat.length}/200
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <Link
              to="/dashboard/projects"
              className="py-3.5 px-6 border border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 py-3.5 px-6 rounded-xl shadow-md shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {submitting ? (
                <Icon icon="line-md:loading-loop" className="w-5 h-5" />
              ) : (
                <Icon icon="heroicons:check-circle" className="w-5 h-5" />
              )}
              {isEditing ? 'Simpan Perubahan' : 'Tambah Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
