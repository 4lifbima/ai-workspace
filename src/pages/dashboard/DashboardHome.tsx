import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    latestProject: null as string | null,
    loading: true
  });
  
  const [chartData, setChartData] = useState({
    lineData: [] as { name: string; projects: number }[],
    donutData: [] as { name: string; value: number }[],
    loading: true
  });

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchChartData();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Get total count
      const { count, error: countError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      if (countError) throw countError;

      // Get latest project
      const { data: latestData, error: latestError } = await supabase
        .from('projects')
        .select('judul')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (latestError) throw latestError;

      setStats({
        totalProjects: count || 0,
        latestProject: latestData?.[0]?.judul || 'Belum ada project',
        loading: false
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchChartData = async () => {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select(`
          created_at,
          category_id,
          project_categories (
            name
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Process Line Chart Data (Projects per month for the last 6 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5 + i, 1);
        return { monthIndex: d.getMonth(), year: d.getFullYear(), name: months[d.getMonth()] };
      });

      const lineData = last6Months.map(m => {
        const count = projects?.filter(p => {
          const d = new Date(p.created_at);
          return d.getMonth() === m.monthIndex && d.getFullYear() === m.year;
        }).length || 0;
        return { name: m.name, projects: count };
      });

      // Process Donut Chart Data (Projects by Category)
      const categoryCounts: Record<string, number> = {};
      let uncategorizedCount = 0;

      projects?.forEach(p => {
        const category = p.project_categories as any;
        if (category && category.name) {
          categoryCounts[category.name] = (categoryCounts[category.name] || 0) + 1;
        } else {
          uncategorizedCount++;
        }
      });

      const donutData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
      if (uncategorizedCount > 0) {
        donutData.push({ name: 'Uncategorized', value: uncategorizedCount });
      }

      setChartData({
        lineData,
        donutData,
        loading: false
      });

    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData(prev => ({ ...prev, loading: false }));
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const COLORS = ['#6435fc', '#9F7AEA', '#38bdf8', '#fbbf24', '#f43f5e', '#10b981'];

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {getGreeting()}, {user?.user_metadata?.full_name || 'Creator'}!
        </h1>
        <p className="text-slate-500">Berikut adalah ringkasan portofolio AI Studio Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Projects Card */}
        <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Icon icon="heroicons:document-text" className="w-7 h-7" />
            </div>
            <span className="text-sm font-semibold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
              <Icon icon="heroicons:arrow-trending-up" className="w-4 h-4" />
              Aktif
            </span>
          </div>
          <h3 className="text-slate-500 font-medium mb-1">Total Project</h3>
          <div className="text-4xl font-bold text-slate-900">
            {stats.loading ? (
              <Icon icon="line-md:loading-loop" className="w-8 h-8 text-primary" />
            ) : (
              stats.totalProjects
            )}
          </div>
        </div>

        {/* Latest Project Card */}
        <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-6">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
              <Icon icon="heroicons:sparkles" className="w-7 h-7" />
            </div>
          </div>
          <h3 className="text-slate-500 font-medium mb-1">Project Terbaru</h3>
          <div className="text-xl font-bold text-slate-900 line-clamp-2">
            {stats.loading ? (
              <Icon icon="line-md:loading-loop" className="w-6 h-6 text-blue-500" />
            ) : (
              stats.latestProject
            )}
          </div>
        </div>

        {/* Gallery Size Card */}
        <div className="bg-gradient-to-br from-primary to-[#9F7AEA] rounded-[24px] p-8 shadow-lg shadow-primary/20 relative overflow-hidden group text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] transition-transform group-hover:scale-110" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
              <Icon icon="heroicons:photo" className="w-7 h-7" />
            </div>
          </div>
          <h3 className="text-white/80 font-medium mb-1 relative z-10">Status Gallery</h3>
          <div className="text-2xl font-bold relative z-10">
            Public & Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Icon icon="heroicons:chart-bar" className="w-5 h-5 text-primary" />
            Statistik Project Baru (6 Bulan Terakhir)
          </h3>
          <div className="h-72 w-full">
            {chartData.loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Icon icon="line-md:loading-loop" className="w-8 h-8 text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                  />
                  <Line type="monotone" dataKey="projects" stroke="#6435fc" strokeWidth={3} dot={{ r: 4, fill: '#6435fc', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Icon icon="heroicons:chart-pie" className="w-5 h-5 text-primary" />
            Kategori Project
          </h3>
          <div className="h-72 w-full flex flex-col items-center justify-center">
            {chartData.loading ? (
              <Icon icon="line-md:loading-loop" className="w-8 h-8 text-primary" />
            ) : chartData.donutData.length === 0 ? (
              <div className="text-slate-400 text-sm">Belum ada data kategori</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={chartData.donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-full mt-4 flex flex-wrap justify-center gap-3">
                  {chartData.donutData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      {entry.name}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
