'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type OrderItem = {
  id: number
  name: string
  quantity: number
  price: number
}

type Order = {
  id: number
  customerName: string
  email: string
  date: string
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered'
  total: number
  items: OrderItem[]
}

const mockOrder: Order = {
  id: 1,
  customerName: 'John Doe',
  email: 'john.doe@example.com',
  date: '2023-07-15',
  status: 'Processing',
  total: 245.67,
  items: [
    { id: 1, name: 'Product A', quantity: 2, price: 49.99 },
    { id: 2, name: 'Product B', quantity: 1, price: 145.69 },
  ]
}

export default function OrderPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    // In a real application, you would fetch the order data from an API
    // For this example, we'll use the mock data
    setOrder(mockOrder)
  }, [params.id])

  const handleStatusUpdate = (newStatus: Order['status']) => {
    if (order) {
      // In a real application, you would send an API request to update the status
      setOrder({ ...order, status: newStatus })
      toast.success(`Order status updated to ${newStatus}`)
    }
  }

  if (!order) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Order #{order.id}</CardTitle>
          <Link href="/dashboard/orders">
            <Button variant="outline" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label>Customer Information</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Name</Label>
                  <p>{order.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p>{order.email}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Order Details</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Order Date</Label>
                  <p>{order.date}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Status</Label>
                  <p className="capitalize">{order.status}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Total</Label>
                  <p>${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Order Items</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-update">Update Status:</Label>
                <Select
                  value={order.status}
                  onValueChange={handleStatusUpdate}
                >
                  <SelectTrigger id="status-update" className="w-[180px] border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
                <Package className="mr-2 h-4 w-4" />
                Print Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  )
}