'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { Loader2, AlertCircle } from 'lucide-react'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

type BlogPost = {
  id: string
  title: string
  author: string
  category: string
  content: string
  featuredImage: string | null
  status: 'draft' | 'published'
}

export default function EditBlogPost() {
  const router = useRouter()
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setPost(data)
    } catch (error) {
      console.error('Error fetching blog post:', error)
      setError('Failed to load blog post. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPost(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setPost(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleContentChange = (content: string) => {
    setPost(prev => prev ? { ...prev, content } : null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real application, you would upload the file to your server or a file hosting service
      // and update the featuredImage URL. For this example, we'll just use a placeholder.
      setPost(prev => prev ? { ...prev, featuredImage: URL.createObjectURL(file) } : null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post) return
    setIsSaving(true)

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      })

      if (!response.ok) {
        throw new Error('Failed to update blog post')
      }

      toast.success('Blog post updated successfully!')
      router.push('/dashboard/blogs')
    } catch (error) {
      console.error('Error updating blog post:', error)
      toast.error('Failed to update blog post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
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

  if (!post) return null

  return (
    <DashboardLayout>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                required
                className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={post.author}
                onChange={handleInputChange}
                required
                className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-2 hidden">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value="test"
                onChange={handleInputChange}
                required
                className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-2 mb-14">
              <Label htmlFor="content">Content</Label>
              <ReactQuill
                value={post.content}
                onChange={handleContentChange}
                className="h-64 mb-12"
                theme="snow"
              />
            </div>
            <div className="space-y-2 hidden">
              <Label htmlFor="featuredImage">Featured Image</Label>
              <Input
                id="featuredImage"
                name="featuredImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
              {post.featuredImage && (
                <img src={post.featuredImage} alt="Featured" className="mt-2 max-w-full h-auto" />
              )}
            </div>
            <div className="space-y-2 pt-7">
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={post.status} onValueChange={(value) => handleSelectChange('status', value as 'draft' | 'published')}>
                <SelectTrigger className="w-full border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Update Blog Post'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  )
}