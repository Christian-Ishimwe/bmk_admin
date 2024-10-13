'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Search, PlusCircle } from 'lucide-react'

// This is dummy data. In a real application, you'd fetch this from your backend.
const subscriptions = [
  { id: '1', name: 'Basic Plan', price: '$9.99', billingCycle: 'Monthly', features: 'Limited access', status: 'Active', subscribers: 1500 },
  { id: '2', name: 'Pro Plan', price: '$19.99', billingCycle: 'Monthly', features: 'Full access', status: 'Active', subscribers: 1000 },
  { id: '3', name: 'Enterprise Plan', price: '$49.99', billingCycle: 'Monthly', features: 'Full access + Priority support', status: 'Active', subscribers: 500 },
  { id: '4', name: 'Basic Annual', price: '$99.99', billingCycle: 'Yearly', features: 'Limited access', status: 'Active', subscribers: 750 },
  { id: '5', name: 'Pro Annual', price: '$199.99', billingCycle: 'Yearly', features: 'Full access', status: 'Inactive', subscribers: 250 },
]

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cycleFilter, setCycleFilter] = useState('all')

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || sub.status.toLowerCase() === statusFilter) &&
    (cycleFilter === 'all' || sub.billingCycle.toLowerCase() === cycleFilter)
  )

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscription Plans</CardTitle>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Plan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-yellow-500" />
              <Input
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px] border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cycleFilter} onValueChange={setCycleFilter}>
                <SelectTrigger className="w-full sm:w-[140px] border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500">
                  <SelectValue placeholder="Filter by cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cycles</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribers</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>{sub.price}</TableCell>
                    <TableCell>{sub.billingCycle}</TableCell>
                    <TableCell>{sub.features}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        sub.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell>{sub.subscribers}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">Showing 1 to 5 of 5 results</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-300 hover:bg-yellow-50">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}