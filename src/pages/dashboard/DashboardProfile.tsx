import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function DashboardProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        bio: user.user_metadata?.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
          bio: formData.bio,
        }
      });

      if (error) throw error;
      
      // Refresh the session to ensure context and UI are updated immediately
      await supabase.auth.refreshSession();
      
      toast.success('Profil berhasil diperbarui');
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Profile</h1>
        <p className="text-slate-500">Kelola informasi profil dan pengaturan akun Anda.</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg shadow-slate-200/50">
              <div className="w-full h-full rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Icon icon="heroicons:user" className="w-10 h-10 text-slate-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="p-8 pt-20 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="heroicons:user" className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 transition-all font-medium"
                    placeholder="Nama lengkap Anda"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email (Read-only)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="heroicons:envelope" className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">URL Foto Profil</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="heroicons:photo" className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 transition-all font-medium"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Bio Singkat</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50 transition-all font-medium resize-none"
                  placeholder="Ceritakan sedikit tentang diri Anda..."
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 py-3.5 px-6 rounded-xl shadow-md shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {loading ? (
                <Icon icon="line-md:loading-loop" className="w-5 h-5" />
              ) : (
                <Icon icon="heroicons:check-circle" className="w-5 h-5" />
              )}
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
