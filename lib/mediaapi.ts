// lib/api.ts
import { StrapiResponse, Wallpaper, Logo } from '@/types/mediaKit';

// Make sure this points to the correct Strapi backend URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';

export async function fetchWallpapers(): Promise<Wallpaper[]> {
  try {
    // Fix the URL construction by ensuring no undefined segments
    const res = await fetch(`${API_URL}/api/wallpapers?populate=*`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch wallpapers: ${res.status}`);
    }
    
    const response: StrapiResponse<any> = await res.json();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching wallpapers:', error);
    return [];
  }
}

export async function fetchLogos(): Promise<Logo[]> {
  try {
    // Fix the URL construction
    const res = await fetch(`${API_URL}/api/logos?populate=*`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch logos: ${res.status}`);
    }
    
    const response: StrapiResponse<any> = await res.json();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching logos:', error);
    return [];
  }
}

export function getFileUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) {
    return path;
  }
  return `${API_URL}${path}`;
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}