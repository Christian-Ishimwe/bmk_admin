'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EditAdminDialog from './EditAdminDialog'
import DeleteAdminDialog from './DeleteAdminDialog'

type Admin = {
  adminId: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  country: string | null
  createdAt: string
}

export default function AdminsTable() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins')
      if (!response.ok) {
        throw new Error('Failed to fetch admins')
      }
      const data = await response.json()
      setAdmins(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast.error('Failed to fetch admins')
      setIsLoading(false)
    }
  }

  const filteredAdmins = admins.filter(admin =>
    `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return <div>Loading admins...</div>
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-yellow-500" />
          <Input
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAdmins.map((admin) => (
            <TableRow key={admin.adminId}>
              <TableCell className="font-medium">{`${admin.firstName} ${admin.lastName}`}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.role}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  admin.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {admin.status}
                </span>
              </TableCell>
              <TableCell>{admin.country || 'N/A'}</TableCell>
              <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <EditAdminDialog admin={admin} onUpdate={fetchAdmins} />
                <DeleteAdminDialog admin={admin} onDelete={fetchAdmins} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  )
}