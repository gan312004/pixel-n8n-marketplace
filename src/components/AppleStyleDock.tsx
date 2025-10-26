"use client"

import { useRouter, usePathname } from 'next/navigation'
import {
  HomeIcon,
  Package,
  Bot,
  DollarSign,
  Gift,
  LayoutDashboard,
} from 'lucide-react'
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock'
import { useSession } from '@/lib/auth-client'

export function AppleStyleDock() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const navigationItems = [
    {
      title: 'Home',
      icon: <HomeIcon className='h-full w-full text-black dark:text-black' />,
      href: '/',
    },
    {
      title: 'Templates',
      icon: <Package className='h-full w-full text-black dark:text-black' />,
      href: '/templates',
    },
    {
      title: 'Agents',
      icon: <Bot className='h-full w-full text-black dark:text-black' />,
      href: '/agents',
    },
    {
      title: 'Pricing',
      icon: <DollarSign className='h-full w-full text-black dark:text-black' />,
      href: '/pricing',
    },
    {
      title: 'Bundles',
      icon: <Gift className='h-full w-full text-black dark:text-black' />,
      href: '/bundles',
    },
  ]

  // Add Dashboard if user is logged in
  if (session?.user) {
    navigationItems.push({
      title: 'Dashboard',
      icon: <LayoutDashboard className='h-full w-full text-black dark:text-black' />,
      href: '/dashboard',
    })
  }

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className='fixed bottom-4 left-1/2 max-w-full -translate-x-1/2 z-50'>
      <Dock className='items-end pb-3'>
        {navigationItems.map((item, idx) => (
          <DockItem
            key={idx}
            className={`aspect-square rounded-full cursor-pointer transition-all ${
              pathname === item.href
                ? 'bg-primary/20 ring-2 ring-primary'
                : 'bg-gray-200 dark:bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handleNavigation(item.href)}
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  )
}
