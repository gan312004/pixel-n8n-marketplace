'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { MobileNav } from '@/components/ui/navbar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession, authClient } from '@/lib/auth-client'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Search, Settings, User, LogOut, LayoutDashboard } from 'lucide-react'

const navigationLinks = [
  {
    name: 'Menu',
    items: [
      { href: '/templates', label: 'Templates' },
      { href: '/agents', label: 'Agents' },
      { href: '/bundles', label: 'Bundles' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
]

export function SearchBar({ className }: React.ComponentProps<'button'>) {
  const isMac =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    navigator.platform?.toUpperCase().includes('MAC')

  return (
    <Button
      variant="secondary"
      className={cn(
        'bg-muted dark:bg-muted relative h-9 w-full justify-start pl-3 pr-12 font-normal shadow-sm border border-border',
        className
      )}
    >
      <Search className="mr-2 h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">Search...</span>

      <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
        <kbd className="pointer-events-none flex h-6 items-center justify-center gap-1 rounded border border-border bg-background px-1.5 font-sans text-[0.7rem] font-medium text-muted-foreground">
          {isMac ? '⌘' : 'Ctrl'}
        </kbd>
        <kbd className="pointer-events-none flex h-6 w-6 items-center justify-center rounded border border-border bg-background font-sans text-[0.7rem] font-medium text-muted-foreground">
          K
        </kbd>
      </div>
    </Button>
  )
}

export default function DashboardNavbar() {
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()
  const { resolvedTheme } = useTheme()

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error(error.code)
    } else {
      localStorage.removeItem('bearer_token')
      refetch()
      router.push('/')
    }
  }

  const userInitials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center justify-start gap-2 md:flex-1 md:gap-4">
          <MobileNav nav={navigationLinks} />

          {/* Logo - Always black text, green accent */}
          <Link
            href="/"
            className="flex items-center gap-3 smooth-hover hover:scale-105 flex-shrink-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-deep-purple to-black rounded-xl flex items-center justify-center pixel-shadow">
              <span className="pixel-text text-neon-green" style={{ fontSize: '8px' }}>
                Auto
              </span>
            </div>
            <span className="pixel-text text-xs hidden sm:block text-black">
              Mart
            </span>
          </Link>

          <SearchBar className="mr-2 hidden md:flex md:w-64 lg:w-80" />
        </div>

        <div className="flex items-center justify-end gap-3">
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="flex items-center gap-1">
              {navigationLinks[0].items.map((link, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        'rounded-md px-3 py-2 text-sm font-medium transition-colors text-black hover:text-primary'
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Separator
            orientation="vertical"
            className="hidden md:flex data-[orientation=vertical]:h-6"
          />

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-5 w-5 text-black" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-2">
                <p className="text-xs text-muted-foreground mb-2">Theme</p>
                <ThemeToggle />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator
            orientation="vertical"
            className="hidden md:flex data-[orientation=vertical]:h-6"
          />

          {/* User Profile Dropdown */}
          {!isPending && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9 border-2 border-primary">
                    <AvatarImage src={session.user.image || undefined} />
                    <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="h-9 text-xs">
              <Link href="/auth">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}