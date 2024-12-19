'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Search, PlusCircle, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { set } from 'date-fns'



export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cycleFilter, setCycleFilter] = useState('all')
  const [membership, setMembership] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // const filteredSubscriptions = membership.filter((sub:any) => 
  //   sub.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //   (statusFilter === 'all' || sub.status.toLowerCase() === statusFilter) &&
  //   (cycleFilter === 'all' || sub.billingCycle.toLowerCase() === cycleFilter)
  // )

 const fetchMembership = async () => {
   try {
     const response = await fetch("/api/membership");
     if (!response.ok) {
       throw new Error("Failed to fetch membership");
     }
     const data = await response.json();
     setMembership(data.membership);
   } catch (error) {
     console.error("Error fetching membership:", error);
     toast.error("Failed to fetch membership");
   } finally {
     setLoading(false);
   }
 };  
    const confirmDeleteUser = (user: any) => {
      setSelectedUser(user);
      setIsDeleteDialogOpen(true);
    };

      const handleDeleteMembership = async () => {
        setIsDeleting(true);
        if (selectedUser) {
          try {
            //@ts-ignore
            const response = await fetch(`/api/membership/${selectedUser.id}`, {
              method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete user");
            toast.success("User deleted");
            fetchMembership();
          } catch (error) {
            toast.error("Failed to delete user");
          } finally {
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
            setIsDeleting(false);
          }
        }
      };


  useEffect(()=>{
   
    fetchMembership()
  }, [])

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscription Requests</CardTitle>
         
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-yellow-500" />
              <Input
                placeholder="Search Request..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            {/* <div className="flex space-x-2 w-full sm:w-auto">
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
            </div> */}
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subscribers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membership? membership.map((sub: any) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        {sub.firstName + " " + sub.surname}
                      </TableCell>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>{sub.subscription}</TableCell>
                      <TableCell>{sub.phone}</TableCell>
                      <TableCell>{sub.ssn || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            sub.status != "pending"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-blue-600"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => {
                            confirmDeleteUser(sub);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )): "No Pending subscriptions"}
                </TableBody>
              </Table>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">Showing  results</p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                disabled={true}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                disabled={true}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Delete Membership Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this Membership? This action cannot
            be undone.
          </p>
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-slate-900 border-s-slate-900"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteMembership}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// function DeleteMembershipModal(isDeleteDialogOpen: boolean, setIsDeleteDialogOpen:any, handleDeleteMembership:any) {
//   return (
//     <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Confirm Delete</DialogTitle>
//         </DialogHeader>
//         <p>
//           Are you sure you want to delete this Membership? This action cannot be
//           undone.
//         </p>
//         <div className="flex justify-end mt-4 space-x-2">
//           <Button
//             onClick={() => setIsDeleteDialogOpen(false)}
//             className="bg-gray-200 hover:bg-gray-300 text-slate-900 border-s-slate-900"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDeleteMembership}
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             Delete
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
