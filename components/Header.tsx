'use client'

import Link from 'next/link'
import { Phone, BarChart3 } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center space-x-2">
            <Phone className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dextego Sales Dashboard
            </h1>
          </div>

          {/* Navigation + Theme Toggle */}
          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/calls" 
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <Phone className="h-4 w-4" />
                <span>Calls</span>
              </Link>
            </nav>

            {/* Theme Switcher */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
