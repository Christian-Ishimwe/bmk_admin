'use client'

import { useState } from 'react'
import Image from 'next/image'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, PlusCircle, Edit, Trash2 } from 'lucide-react'

const products = [
  { id: '1', name: 'Wireless Headphones', category: 'Electronics', price: '$129.99', stock: 50, image: '/placeholder.svg?height=200&width=200' },
  { id: '2', name: 'Smartphone', category: 'Electronics', price: '$699.99', stock: 30, image: '/placeholder.svg?height=200&width=200' },
  { id: '3', name: 'Laptop', category: 'Electronics', price: '$1299.99', stock: 20, image: '/placeholder.svg?height=200&width=200' },
  { id: '4', name: 'Running Shoes', category: 'Sports', price: '$89.99', stock: 100, image: '/placeholder.svg?height=200&width=200' },
  { id: '5', name: 'Coffee Maker', category: 'Home', price: '$59.99', stock: 40, image: '/placeholder.svg?height=200&width=200' },
  { id: '6', name: 'Backpack', category: 'Fashion', price: '$49.99', stock: 75, image: '/placeholder.svg?height=200&width=200' },
]

const categories = ['All', 'Electronics', 'Sports', 'Home', 'Fashion']

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === 'All' || product.category === categoryFilter)
  )

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-yellow-500" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px] border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <p className="font-bold text-yellow-600 mb-2">{product.price}</p>
                  <p className="text-sm text-gray-600 mb-4">Stock: {product.stock}</p>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}