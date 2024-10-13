import SignInForm from '@/components/SignInForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
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