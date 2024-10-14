'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-toastify'
import { Edit, Loader2 } from 'lucide-react'

type Admin = {
  adminId: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  country: string | null
}

type EditAdminDialogProps = {
  admin: Admin
  onUpdate: () => void
}

export default function EditAdminDialog({ admin, onUpdate }: EditAdminDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editedAdmin, setEditedAdmin] = useState(admin)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedAdmin(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedAdmin(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admins/${admin.adminId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedAdmin),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update admin')
      }

      await response.json()
      toast.success('Admin updated successfully')
      setIsOpen(false)
      onUpdate()
    } catch (error) {
      console.error('Error updating admin:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update admin')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={editedAdmin.firstName}
              onChange={handleInputChange}
              required
              className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={editedAdmin.lastName}
              onChange={handleInputChange}
              required
              className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={editedAdmin.email}
              onChange={handleInputChange}
              required
              className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" value={editedAdmin.role} onValueChange={(value) => handleSelectChange('role', value)}>
              <SelectTrigger className="w-full border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" value={editedAdmin.status} onValueChange={(value) => handleSelectChange('status', value)}>
              <SelectTrigger className="w-full border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={editedAdmin.country || ''}
              onChange={handleInputChange}
              className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Admin...
              </>
            ) : (
              'Update Admin'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}