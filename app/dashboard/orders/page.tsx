'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Loader2, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'

type Borrower = {
  userId: string
  name: string
  email: string
  verified: boolean
  role: string
  plan: string
  active: boolean
  country: string
  createdAt: string
}

type Order = {
  id: number
  orderId: string
  productId: string
  borrowerId: string
  lenderId: string
  orderDate: string
  lendingFrom: string
  lendingTo: string
  totalPrice: number
  status: string
  paymentMethod: string | null
  createdAt: string
  updatedAt: string
  borrower: Borrower
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ordersPerPage = 10

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    fetchOrders()
  }, [currentPage])

  useEffect(() => {
    applyFilters()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/orders?page=${currentPage}&limit=${ordersPerPage}`)
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = orders.filter(order => 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  // Filter by borrower name
      order.borrowerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.lenderId.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
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
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
              </div>
              <div className="w-1/4">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
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
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead> {/* New column for Borrower */}
                    <TableHead>Order Date</TableHead>
                    <TableHead>Lending Period</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.orderId}</TableCell>
                      <TableCell>{order.borrower.name}</TableCell> {/* Display Borrower's name */}
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{`${formatDate(order.lendingFrom)} - ${formatDate(order.lendingTo)}`}</TableCell>
                      <TableCell>SEK {order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          order.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/orders/${order.orderId}`}>
                          <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                            <Eye className="h-4 w-4 mr-2" />
                            View
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
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
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
