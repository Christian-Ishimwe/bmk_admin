'use client'

import { use, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PlusCircle, Search, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
type BlogPost = {
  id: number
  title: string
  author: string
  category: string
  publishDate: string
  status: 'Published' | 'Draft'
}

const initialBlogPosts: BlogPost[] = [
  { id: 1, title: 'Introduction to BigKoko Marketplace', author: 'John Doe', category: 'General', publishDate: '2023-06-01', status: 'Published' },
  { id: 2, title: 'Top 10 Products This Month', author: 'Jane Smith', category: 'Products', publishDate: '2023-06-15', status: 'Published' },
  { id: 3, title: 'How to Become a Successful Seller', author: 'Bob Johnson', category: 'Sellers', publishDate: '2023-06-20', status: 'Draft' },
  { id: 4, title: 'Customer Service Best Practices', author: 'Alice Brown', category: 'Customer Service', publishDate: '2023-07-01', status: 'Published' },
  { id: 5, title: 'Upcoming Features in BigKoko', author: 'Charlie Wilson', category: 'Updates', publishDate: '2023-07-10', status: 'Draft' },
]

export default function BlogsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const router= useRouter()

 

  
  const handleDelete = (id: number) => {
    setBlogPosts(prev => prev.filter(post => post.id !== id))
    toast.success('Blog post deleted successfully!')
  }

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Blog Posts</CardTitle>
          
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900" onClick={()=>{
                router.push('/dashboard/blogs/new')
              }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Post
              </Button>

           
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-yellow-500" />
              <Input
                placeholder="Search by title, author, or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.publishDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 border-red-300 hover:bg-red-50"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  )
}