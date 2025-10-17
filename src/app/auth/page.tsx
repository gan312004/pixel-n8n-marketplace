"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import LeftSidebar from '@/components/LeftSidebar'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        // Login
        const { data, error } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
          callbackURL: "/dashboard"
        })

        if (error?.code) {
          toast.error("Invalid email or password. Please try again.")
          setIsLoading(false)
          return
        }

        toast.success("Welcome back!")
        router.push("/dashboard")
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match")
          setIsLoading(false)
          return
        }

        const { data, error } = await authClient.signUp.email({
          email: formData.email,
          name: formData.name,
          password: formData.password
        })

        if (error?.code) {
          const errorMap: Record<string, string> = {
            USER_ALREADY_EXISTS: "Email already registered. Please sign in instead."
          }
          toast.error(errorMap[error.code] || "Registration failed. Please try again.")
          setIsLoading(false)
          return
        }

        toast.success("Account created successfully!")
        router.push("/login?registered=true")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    try {
      const { data, error } = await authClient.signIn.social({
        provider: provider,
        callbackURL: "/dashboard"
      })

      if (error?.code) {
        toast.error(`${provider === 'google' ? 'Google' : 'GitHub'} sign-in failed. Please try again.`)
        setIsLoading(false)
        return
      }
    } catch (error) {
      toast.error("Authentication failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <>
      <LeftSidebar />
      <div className="min-h-screen bg-background pl-32">
        <div className="flex items-center justify-center px-4 py-12 pt-32">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground smooth-hover"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-deep-purple to-black rounded-lg flex items-center justify-center pixel-shadow">
                  <span className="pixel-text text-dark-green" style={{ fontSize: '10px' }}>Auto</span>
                </div>
                <h1 className="pixel-text text-2xl mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin
                    ? 'Sign in to access your templates'
                    : 'Join our automation community'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required={!isLogin}
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="off"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="off"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value
                        })
                      }
                      required={!isLogin}
                      disabled={isLoading}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full pixel-text text-xs bg-primary hover:bg-primary/90 smooth-hover"
                  disabled={isLoading}
                >
                  {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-foreground smooth-hover"
                  disabled={isLoading}
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="smooth-hover hover:scale-105"
                    onClick={() => handleSocialSignIn('google')}
                    disabled={isLoading}
                  >
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="smooth-hover hover:scale-105"
                    onClick={() => handleSocialSignIn('github')}
                    disabled={isLoading}
                  >
                    GitHub
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}