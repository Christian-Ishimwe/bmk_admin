'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Admin = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

export default function AdminsManagement() {
  const [admins, setAdmins] = useState<Admin[]>([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Super Admin', status: 'active' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'Admin', status: 'active' },
    { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', role: 'Moderator', status: 'inactive' },
  ])

  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Admin'
  })

  const [editAdmin, setEditAdmin] = useState<Admin | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; adminId: number | null }>({
    isOpen: false,
    adminId: null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAdmin(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setNewAdmin(prev => ({ ...prev, role: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = Math.max(...admins.map(admin => admin.id)) + 1
    setAdmins(prev => [...prev, { id: newId, ...newAdmin, status: 'active' } as Admin])
    setNewAdmin({ firstName: '', lastName: '', email: '', password: '', role: 'Admin' })
    toast.success('New admin added successfully!')
  }

  const handleDeleteClick = (adminId: number) => {
    setDeleteConfirmation({ isOpen: true, adminId })
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.adminId) {
      setAdmins(prev => prev.filter(admin => admin.id !== deleteConfirmation.adminId))
      toast.success('Admin deleted successfully!')
      setDeleteConfirmation({ isOpen: false, adminId: null })
    }
  }

  const handleEditClick = (admin: Admin) => {
    setEditAdmin(admin)
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editAdmin) {
      setAdmins(prev => prev.map(admin => admin.id === editAdmin.id ? editAdmin : admin))
      setIsEditDialogOpen(false)
      setEditAdmin(null)
      toast.success('Admin updated successfully!')
    }
  }

  const toggleAdminStatus = (adminId: number) => {
    setAdmins(prev => prev.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' } 
        : admin
    ))
    toast.success('Admin status updated successfully!')
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Admins Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4 bg-yellow-500 hover:bg-yellow-600 text-yellow-900">Add New Admin</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={newAdmin.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={newAdmin.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newAdmin.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" value={newAdmin.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
                  Add Admin
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{`${admin.firstName} ${admin.lastName}`}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      className="mr-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                      onClick={() => handleEditClick(admin)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`mr-2 ${
                        admin.status === 'active' 
                          ? 'text-red-500 hover:text-red-700 border-red-300 hover:bg-red-50' 
                          : 'text-green-500 hover:text-green-700 border-green-300 hover:bg-green-50'
                      }`}
                      onClick={() => toggleAdminStatus(admin.id)}
                    >
                      {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-500 hover:text-red-700 border-red-300 hover:bg-red-50"
                      onClick={() => handleDeleteClick(admin.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          {editAdmin && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select 
                  name="role" 
                  value={editAdmin.role} 
                  onValueChange={(value) => setEditAdmin({...editAdmin, role: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
                Update Admin
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmation.isOpen} onOpenChange={(isOpen) => setDeleteConfirmation({ isOpen, adminId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this admin? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation({ isOpen: false, adminId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  )
}