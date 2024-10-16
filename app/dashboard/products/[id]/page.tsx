'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowLeft, Loader2, Save, User, PackageSearch } from 'lucide-react'

type Owner = {
  userId: string
  name: string
  email: string
  phone: string
  address: string
}

type Product = {
  id: string
  itemName: string
  description: string
  lendingFrom: string
  lendingTo: string
  category: string
  condition: string
  dailyPricing: number
  weeklyPricing: number
  monthlyPricing: number
  specifications: string
  safetyTips: string
  specialInstructions: string
  usage: string
  securityDeposit: number
  dimensions: string
  brands: string
  isAvailable: boolean
  photos: string[]
  createdAt: string
  updatedAt: string
  isLent: boolean
  ownerId: string
  pickupLocation: string
  owner: Owner
}

const categories = [
  "Electronics",
  "Home & Garden",
  "Sports & Outdoors",
  "Tools & Equipment",
  "Vehicles",
  "Clothing & Accessories",
  "Party & Events",
  "Music & Instruments",
  "Toys & Games",
  "Books & Media"
]

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to fetch product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleToggleChange = (name: string) => {
    // @ts-ignore
    setProduct(prev => prev ? { ...prev, [name]: !prev[name] } : null)
  }

  const handleSave = async () => {
    if (!product) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      const updatedProduct = await response.json()
      setProduct(updatedProduct)
      setIsEditing(false)
      toast.success('Product updated successfully')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    } finally {
      setIsUpdating(false)
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

  if (!product) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
          <PackageSearch className="h-24 w-24 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
            onClick={() => router.push('/dashboard/products')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Products
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Card className="w-full mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEditing ? 'Edit Product' : product.itemName}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
              onClick={() => router.push('/dashboard/products')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
            
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  name="itemName"
                  value={product.itemName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  value={product.category}
                  disabled={!isEditing}
                />  
                
                  
                  
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dailyPricing">Daily Price ($)</Label>
                <Input
                  id="dailyPricing"
                  name="dailyPricing"
                  type="number"
                  value={product.dailyPricing}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="weeklyPricing">Weekly Price ($)</Label>
                <Input
                  id="weeklyPricing"
                  name="weeklyPricing"
                  type="number"
                  value={product.weeklyPricing}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="monthlyPricing">Monthly Price ($)</Label>
                <Input
                  id="monthlyPricing"
                  name="monthlyPricing"
                  type="number"
                  value={product.monthlyPricing}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea
                id="specifications"
                name="specifications"
                value={product.specifications}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="safetyTips">Safety Tips</Label>
              <Textarea
                id="safetyTips"
                name="safetyTips"
                value={product.safetyTips}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="specialInstructions">Special Instructions</Label>
              <Textarea
                id="specialInstructions"
                name="specialInstructions"
                value={product.specialInstructions}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="usage">Usage</Label>
              <Textarea
                id="usage"
                name="usage"
                value={product.usage}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={2}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
                <Input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  value={product.securityDeposit}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  value={product.dimensions}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Input
                  value={product.condition}
                  disabled={!isEditing}
                />
                  

              </div>
            </div>
            <div>
              <Label htmlFor="brands">Brands</Label>
              <Input
                id="brands"
                name="brands"
                value={product.brands}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="pickupLocation">Pickup Location</Label>
              <Input
                id="pickupLocation"
                name="pickupLocation"
                value={product.pickupLocation}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lendingFrom">Lending From</Label>
                <Input
                  id="lendingFrom"
                  name="lendingFrom"
                  type="date"
                  value={product.lendingFrom.split('T')[0]}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="lendingTo">Lending To</Label>
                <Input
                  id="lendingTo"
                  name="lendingTo"
                  type="date"
                  value={product.lendingTo.split('T')[0]}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={product.isAvailable}
                onCheckedChange={() => handleToggleChange('isAvailable')}
                disabled={!isEditing}
              />
              <Label htmlFor="isAvailable">Available</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isLent"
                checked={product.isLent}
                onCheckedChange={() => handleToggleChange('isLent')}
                disabled={!isEditing}
              />
              <Label htmlFor="isLent">Currently Lent</Label>
            </div>
            {isEditing && (
              <Button
                onClick={handleSave}
                className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {product.photos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={photo}
                  alt={`Product image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Owner Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-4">
              <User className="h-12 w-12 text-yellow-500" />
              <div>
                <p className="font-semibold">{product.owner.name}</p>
                <p className="text-sm text-gray-500">{product.owner.email}</p>
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <p>{product.owner.phone}</p>
            </div>
            <div>
              <Label>Address</Label>
              <p>{product.owner.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </DashboardLayout>
  )
}