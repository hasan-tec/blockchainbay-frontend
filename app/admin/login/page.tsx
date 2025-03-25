// app/admin/login/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"
import { useAuth } from "@/contexts/AuthContext"

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const { login, isAdmin, loading, user } = useAuth()
  const router = useRouter()

  // If already logged in, redirect to admin giveaways
  useEffect(() => {
    if (!loading && user && isAdmin && !redirecting) {
      console.log('[LoginPage] Already logged in, redirecting to admin panel');
      setRedirecting(true);
      router.push('/admin/giveaways');
    }
  }, [loading, user, isAdmin, router, redirecting]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || redirecting) return;
    
    setIsLoading(true)
    setError("")

    try {
      console.log('[LoginPage] Attempting login...');
      const success = await login(identifier, password)
      if (success) {
        console.log('[LoginPage] Login successful, redirecting...');
        setRedirecting(true);
        // Router push is handled in the login function
      } else {
        console.log('[LoginPage] Login failed');
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      console.error('[LoginPage] Login error:', err);
      setError("An error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07071C] flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-[#F7984A] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If already authenticated or redirecting, show loading
  if (redirecting) {
    return (
      <div className="min-h-screen bg-[#07071C] flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-[#F7984A] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Redirecting to admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07071C] text-white">
      {/* Background elements */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
          <div className="absolute top-[40%] right-[15%] w-[20rem] h-[20rem] rounded-full bg-blue-500/5 blur-[8rem]"></div>
        </div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="bg-[#0D0B26]/80 border border-gray-800/50 overflow-hidden">
            <div className="p-6 border-b border-gray-800/50">
              <div className="flex flex-col items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-[#F7984A]/20 flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-[#F7984A]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Admin Login</h2>
                <p className="text-gray-400 mt-2">Enter your credentials to access admin panel</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="text-white space-y-2">
                <Label htmlFor="email">Email or Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="text"
                    placeholder="admin@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoComplete="username"
                    className="bg-[#07071C] border-gray-800 pl-10 text-white placeholder:text-gray-500 focus:border-[#F7984A]/50 focus:ring-[#F7984A]/20"
                  />
                </div>
              </div>

              <div className="text-white space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="bg-[#07071C] border-gray-800 pl-10 pr-10 text-white placeholder:text-gray-500 focus:border-[#F7984A]/50 focus:ring-[#F7984A]/20"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="text-gray-400 hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white py-2 h-12 mt-6"
                disabled={isLoading || redirecting}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}