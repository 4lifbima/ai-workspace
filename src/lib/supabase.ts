/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProjectCategory = {
  id: number;
  name: string;
  created_at: string;
};

export type Project = {
  id: number;
  created_at: string;
  user_id: string;
  judul: string;
  gambar_url: string;
  link_project: string;
  deskripsi_singkat: string;
  views?: number;
  category_id?: number | null;
  project_categories?: ProjectCategory;
};

export type Profile = {
  id: string;
  updated_at: string;
  full_name: string;
  avatar_url: string;
  bio: string;
};
