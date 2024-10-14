'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-toastify'
import { PlusCircle, Loader2 } from 'lucide-react'

type AddAdminDialogProps = {
  onAdminAdded: () => void
}

export default function AddAdminDialog({ onAdminAdded }: AddAdminDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    country: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAdmin(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewAdmin(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add admin')
      }

      await response.json()
      toast.success('Admin added successfully')
      setIsOpen(false)
      setNewAdmin({ firstName: '', lastName: '', email: '', role: '', password: '', country: '' })
      onAdminAdded()
    } catch (error) {
      console.error('Error adding admin:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add admin')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Admin
        </Button>
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
              className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
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
              className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
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
              className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" value={newAdmin.role} onValueChange={(value) => handleSelectChange('role', value)}>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={newAdmin.password}
              onChange={handleInputChange}
              required
              className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={newAdmin.country}
              onChange={handleInputChange}
              className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>
          <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Admin...
              </>
            ) : (
              'Add Admin'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}