// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  role: {
    id: number;
    name: string;
    type: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is already logged in
  useEffect(() => {
    async function loadUser() {
      try {
        console.log('[AuthContext] Checking for authenticated user...');
        const res = await fetch('/api/auth/user');
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          
          // Check if user has admin role
          const isUserAdmin = userData.role?.name === 'Admin' || userData.role?.type === 'admin';
          setIsAdmin(isUserAdmin);
          
          console.log("[AuthContext] User authenticated", userData);
          
          // If we're on the login page and already authenticated, redirect to the admin panel
          if (pathname === '/admin/login' && isUserAdmin) {
            console.log('[AuthContext] Already logged in on login page, redirecting to admin panel');
            router.push('/admin/giveaways');
          }
        } else {
          console.log("[AuthContext] No authenticated user found");
          
          // If we're on a protected route and not authenticated, middleware will handle the redirect
        }
      } catch (error) {
        console.error('[AuthContext] Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [pathname, router]);

  // Login function
  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('[AuthContext] Attempting login...');
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) {
        console.error('[AuthContext] Login failed:', await res.text());
        return false;
      }

      const data = await res.json();
      console.log('[AuthContext] Login successful:', data);
      
      setUser(data.user);
      
      // Check if user has admin role
      const isUserAdmin = data.user.role?.name === 'Admin' || data.user.role?.type === 'admin';
      setIsAdmin(isUserAdmin);
      
      // Wait for state updates to be processed before redirect
      setTimeout(() => {
        router.push('/admin/giveaways');
      }, 100);
      
      return true;
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('[AuthContext] Logging out...');
      
      await fetch('/api/auth/logout', { 
        method: 'POST' 
      });
      
      setUser(null);
      setIsAdmin(false);
      
      console.log('[AuthContext] Logged out, redirecting to login');
      router.push('/admin/login');
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}