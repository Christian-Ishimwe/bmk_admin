'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Search, Loader2, ChevronLeft, ChevronRight, PlusCircle, Eye } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'

type Product = {
  id: string
  itemName: string
  category: string
  dailyPricing: number
  isAvailable: boolean
  isLent: boolean
  condition: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const productsPerPage = 10

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('')
  const [lentFilter, setLentFilter] = useState('')
  const [conditionFilter, setConditionFilter] = useState('')
  const [priceRange, setPriceRange] = useState([0, 100])
 const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products?page=${currentPage}&limit=${productsPerPage}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage])

  
  useEffect(() => {

    let filtered = products.filter(product => 
      product.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    if (availabilityFilter && availabilityFilter !== 'all') {
      filtered = filtered.filter(product => 
        availabilityFilter === 'available' ? product.isAvailable : !product.isAvailable
      )
    }

    if (lentFilter && lentFilter !== 'all') {
      filtered = filtered.filter(product => 
        lentFilter === 'lent' ? product.isLent : !product.isLent
      )
    }

    if (conditionFilter && conditionFilter !== 'all') {
      filtered = filtered.filter(product => product.condition === conditionFilter)
    }

    filtered = filtered.filter(product => 
      product.dailyPricing >= priceRange[0] && product.dailyPricing <= priceRange[1]
    )

    setFilteredProducts(filtered)
    setTotalPages(Math.ceil(filtered.length / productsPerPage))
  }, [products, searchTerm, categoryFilter, availabilityFilter, lentFilter, conditionFilter, priceRange])


 
  

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
<div className="flex gap-4">
  <div className="flex-1">
    <Label htmlFor="search">Search</Label>
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-yellow-500" />
      <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
              </div>
              
              <div className="w-1/4">
                <Label htmlFor="availability">Availability</Label>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger id="availability">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/4">
                <Label htmlFor="lent">Lent Status</Label>
                <Select value={lentFilter} onValueChange={setLentFilter}>
                  <SelectTrigger id="lent">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="lent">Lent</SelectItem>
                    <SelectItem value="not-lent">Not Lent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Label>Daily Price Range</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Daily Price</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Lent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.itemName}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.dailyPricing.toFixed(2)}</TableCell>
                      <TableCell>{product.condition}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isAvailable ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.isLent ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.isLent ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/products/${product.id}`}>
                          <Button variant="outline" size="sm" className="mr-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  )
}