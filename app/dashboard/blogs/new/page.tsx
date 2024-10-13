'use client'
import { useState } from 'react'
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

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function NewBlogPost() {
  const [post, setPost] = useState({
    title: '',
    author: '',
    category: '',
    content: '',
    featuredImage: null as File | null,
    status: 'Draft' as 'Draft' | 'Published'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPost(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setPost(prev => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setPost(prev => ({ ...prev, content }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPost(prev => ({ ...prev, featuredImage: file }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the blog post data to your backend
    console.log('New blog post:', post)
    toast.success('Blog post created successfully!')
  }

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
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
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={post.category}
                onChange={handleInputChange}
                required
                className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <ReactQuill
                value={post.content}
                onChange={handleContentChange}
                className="h-64 mb-12"
                theme="snow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image</Label>
              <Input
                id="featuredImage"
                name="featuredImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={post.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="w-full border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
              Create Blog Post
            </Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  )
}