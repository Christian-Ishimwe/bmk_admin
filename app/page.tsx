"use client"
import SignInForm from '@/components/SignInForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === 'loading') {
    // Splash screen when validating session
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-yellow-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-yellow-500 border-solid"></div>
          <p className="mt-4 text-yellow-700">Loading...</p>
        </div>
      </main>
    )
  }

  if (status === "authenticated") {
    router.push('/dashboard')
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-yellow-50">
      <Card className="w-[350px] border-yellow-200 shadow-lg">
        <CardHeader className="bg-yellow-100 rounded-t-lg">
          <CardTitle className="text-yellow-800">Welcome to BigKoko</CardTitle>
          <CardDescription className="text-yellow-700">Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <SignInForm />
        </CardContent>
      </Card>
    </main>
  )
}
