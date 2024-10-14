'use client'

import { useState } from 'react'
import  { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'react-toastify'
import { Trash2, Loader2 } from 'lucide-react'

type Admin = {
  adminId: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  country: string | null
}

type DeleteAdminDialogProps = {
  admin: Admin
  onDelete: () => void
}

export default function DeleteAdminDialog({ admin, onDelete }: DeleteAdminDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admins/${admin.adminId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete admin')
      }

      toast.success('Admin deleted successfully')
      setIsOpen(false)
      onDelete()
    } catch (error) {
      console.error('Error deleting admin:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete admin')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 border-red-300 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Admin</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete the admin {admin.firstName} {admin.lastName}?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}