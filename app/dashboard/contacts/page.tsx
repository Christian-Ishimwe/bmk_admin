'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Mail, Trash2, X, Search, Loader2, AlertCircle, InboxIcon } from 'lucide-react'

type Contact = {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
  message: string
  replied: boolean
  repliedBy: string | null
  replyMessage: string | null
  replyOn: string | null
  createdAt: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [contacts, searchTerm, statusFilter])

  const fetchContacts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/contacts')
      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }
      const data = await response.json()
      setContacts(data)
    } catch (err) {
      setError('An error occurred while fetching contacts. Please try again later.')
      console.error('Error fetching contacts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter === 'replied') {
      filtered = filtered.filter(contact => contact.replied)
    } else if (statusFilter === 'unreplied') {
      filtered = filtered.filter(contact => !contact.replied)
    }

    setFilteredContacts(filtered)
  }

  const handleReply = (contact: Contact) => {
    setSelectedContact(contact)
    setIsReplyModalOpen(true)
  }

  const handleSendReply = async () => {
    if (selectedContact) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contactId:selectedContact.id, replyMessage }),
        })
        if (!response.ok) {
          throw new Error('Failed to send reply')
        }
        const updatedContact = await response.json()
        setContacts(contacts.map(contact => 
          contact.id === updatedContact.id ? updatedContact : contact
        ))
        setIsReplyModalOpen(false)
        setReplyMessage('')
        toast.success('Reply sent successfully')
      } catch (err) {
        console.error('Error sending reply:', err)
        toast.error('Failed to send reply. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDeleteConfirmation = (contact: Contact) => {
    setSelectedContact(contact)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (selectedContact) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/contacts`, {
          method: 'DELETE',

          body: JSON.stringify({id: selectedContact.id})
        })
        if (!response.ok) {
          throw new Error('Failed to delete contact')
        }
        setContacts(contacts.filter(contact => contact.id !== selectedContact.id))
        setIsDeleteModalOpen(false)
        toast.success('Contact deleted successfully')
      } catch (err) {
        console.error('Error deleting contact:', err)
        toast.error('Failed to delete contact. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-xl font-semibold text-center">{error}</p>
            <Button onClick={fetchContacts} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-yellow-500" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="unreplied">Unreplied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <InboxIcon className="h-16 w-16 text-yellow-500 mb-4" />
              <p className="text-xl font-semibold text-center">No messages found</p>
              <p className="text-gray-500 text-center mt-2">There are no contact messages matching your criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id} className={contact.replied ? 'bg-green-50' : ''}>
                    <TableCell>{`${contact.firstName} ${contact.lastName}`}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.role}</TableCell>
                    <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        contact.replied ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contact.replied ? 'Replied' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleReply(contact)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => handleDeleteConfirmation(contact)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription>
              Respond to the contact message. This reply will be sent to the user&apos;s email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={`${selectedContact?.firstName} ${selectedContact?.lastName}`}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={selectedContact?.email}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea
                id="message"
                value={selectedContact?.message}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reply" className="text-right">
                Reply
              </Label>
              <Textarea
                id="reply"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyModalOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSendReply} className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Mail className="h-4 w-4 mr-1" />
              )}
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  )
}