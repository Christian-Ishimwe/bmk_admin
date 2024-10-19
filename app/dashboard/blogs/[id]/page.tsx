'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowLeft, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  
  imageUrl: string
}

export default function BlogPostPage() {
  const router = useRouter()
  const { id } = useParams()
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchBlogPost()
  }, [id])

  const fetchBlogPost = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/blogs/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blog post')
      }
      const data = await response.json()
      setBlogPost(data)
    } catch (err) {
      setError('An error occurred while fetching the blog post. Please try again later.')
      console.error('Error fetching blog post:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/dashboard/blogs/${id}/edit`)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete blog post')
      }
      toast.success('Blog post deleted successfully')
      router.push('/dashboard/blogs')
    } catch (err) {
      console.error('Error deleting blog post:', err)
      toast.error('Failed to delete blog post. Please try again.')
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-xl font-semibold text-center">{error}</p>
            <Button onClick={fetchBlogPost} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  if (!blogPost) {
    return null
  }

  return (
    <DashboardLayout>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/blogs')}
              className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Button>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="mr-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold mb-2">{blogPost.title}</CardTitle>
          <CardDescription>
            <span className="text-yellow-600 font-semibold"></span> | By {blogPost.author} | 
            Published on {new Date(blogPost.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {blogPost.imageUrl && (
            <div className="mb-6">
              <Image
                src={blogPost.imageUrl}
                alt={blogPost.title}
                width={800}
                height={400}
                className="rounded-lg object-cover w-full h-64"
              />
            </div>
          )}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          {/* <div className="mt-6">
            {blogPost.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
          </div> */}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  )
}