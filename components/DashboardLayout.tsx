"use client"
import React, { useMemo } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Bell, Home, ShoppingCart, Users, Package, CreditCard, Settings, LogOut, Shield, MessageSquare, FileText } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const sessionStatus = useMemo(() => ({ session, status }), [session, status])

  if (sessionStatus.status === 'loading') return null

  if (sessionStatus.status === "unauthenticated") {
    router.push('/')
    toast.warning("You need to sign in first")
    return null
  }

  return (
    <div className="flex h-screen bg-yellow-50">
      {/* Sidebar */}
      <aside className="w-64 bg-yellow-100 text-yellow-900 overflow-y-auto">
        <div className="p-4">
          <h1 className="text-2xl font-bold">BigKoko Admin</h1>
        </div>
        <nav className="mt-8 space-y-1">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-yellow-800 hover:bg-yellow-200">
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/orders" className="flex items-center px-4 py-2 text-yellow-800 hover:bg-yellow-200">
            <ShoppingCart className="mr-3 h-5 w-5" />
            Orders
          </Link>
          <Link href="/dashboard/users" className="flex items-center px-4 py-2 text-yellow-800 hover:bg-yellow-200">
            <Users className="mr-3 h-5 w-5" />
            Users
          </Link>
          <Link href="/dashboard/products" className="flex items-center px-4 py-2 text-yellow-800 hover:bg-yellow-200">
            <Package className="mr-3 h-5 w-5" />
            Products
          </Link>
          <Link href="/dashboard/subscriptions" className="flex items-center px-4 py-2 text-yellow-800 hover:bg-yellow-200">
            <CreditCard className="mr-3 h-5 w-5" />
            Subscriptions
          </Link>
          <Link href="/dashboard/admins" className="flex items-center px-4 py-2 text-yellow-800 hover:bg-yellow-200">
            <Shield className="mr-3 h-5 w-5" />
            Admins
          </Link>
          <Link href="/dashboard/contacts" className="flex items-center px-4 py-2 text-yellow-800 hover:bg-yellow-200">
            <MessageSquare className="mr-3 h-5 w-5" />
            Contacts
          </Link>
          <Link href="/dashboard/blogs" className="flex items-center px-4 py-2 text-yellow-800 hover:bg-yellow-200">
            <FileText className="mr-3 h-5 w-5" />
            Blogs
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-yellow-800 hover:bg-yellow-200">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold leading-7 text-yellow-900 sm:truncate">Dashboard</h2>
            <div className="flex items-center">
              {/* <button className="p-1 rounded-full text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button> */}
              <button className="ml-3 p-1 rounded-full text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500" 
                onClick={() => signOut()}
              >
                <span className="sr-only">Log out</span>
                <LogOut className="h-6 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-yellow-50 p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
