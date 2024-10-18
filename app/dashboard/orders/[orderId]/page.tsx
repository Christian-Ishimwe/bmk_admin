"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Package, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

type Borrower = {
  userId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
};

type Lender = {
  userId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
};

type Product = {
  id: string;
  itemName: string;
  description: string;
  dailyPricing: number;
  photos: string[];
  pickupLocation: string;
};

type Order = {
  orderId: string;
  orderDate: string;
  lendingFrom: string;
  lendingTo: string;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | "Cancelled";
  paymentMethod: string;
  borrower: Borrower;
  lender: Lender;
  product: Product;
};

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/orders/${params.orderId}`);
        if (response.ok) {
          const data: Order = await response.json();
          setOrder(data);
        } else {
          toast.error('Failed to fetch order data');
        }
      } catch (error) {
        toast.error('Error fetching order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId]);

  const handleStatusUpdate = (newStatus: Order['status']) => {
    if (order) {
      setOrder({ ...order, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMMM d, yyyy');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
          <PackageSearch className="h-24 w-24 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
            onClick={() => router.push('/dashboard/orders')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Orders
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Order #{order.orderId}</CardTitle>
          <Link href="/dashboard/orders">
            <Button variant="outline" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Customer and Lender Info */}
            <div className="grid gap-2">
              <Label className='font-bold'>Borrower Information</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Name</Label>
                  <p>{order.borrower.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p>{order.borrower.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Phone</Label>
                  <p>{order.borrower.phone}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Country</Label>
                  <p>{order.borrower.country}</p>
                </div>
              </div>

              <Label className="font-bold">Lender Information</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Name</Label>
                  <p>{order.lender.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p>{order.lender.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Phone</Label>
                  <p>{order.lender.phone}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Country</Label>
                  <p>{order.lender.country}</p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid gap-2">
              <Label>Order Details</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Order Date</Label>
                  <p>{formatDate(order.orderDate)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Status</Label>
                  <p className="capitalize">{order.status}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Total</Label>
                  <p>${order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Lending From</Label>
                  <p>{formatDate(order.lendingFrom)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Lending To</Label>
                  <p>{formatDate(order.lendingTo)}</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="grid gap-2">
              <Label>Product</Label>
              <div>
                <Label className="text-sm text-gray-500">Product Name</Label>
                <Link href={`/products/${order.product.id}`}>
                  <p className="text-blue-500 underline cursor-pointer">{order.product.itemName}</p>
                </Link>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Description</Label>
                <p>{order.product.description}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Daily Pricing</Label>
                <p>${order.product.dailyPricing.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Pickup Location</Label>
                <p>{order.product.pickupLocation}</p>
              </div>
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
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900" disabled={order.status === "Cancelled"}>
                Update Status
              </Button>

            </div>
          </div>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  );
}
