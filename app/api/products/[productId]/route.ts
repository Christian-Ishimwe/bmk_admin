import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  try {
    const { productId } = params
    const response = await fetch(`${process.env.BACKEND_URL}/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update admin')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json({ error: 'Failed to get product status' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { adminId: string } }) {
  try {
    const { adminId } = params
    const response = await fetch(`${process.env.BACKEND_URL}/admins/${adminId}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete admin')
    }

    return NextResponse.json({ message: 'Admin deleted successfully' })
  } catch (error) {
    console.error('Error deleting admin:', error)
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { productId: string } }) {
  try {
    const { productId } = params
    const productUpdates = await request.json() // Parse the JSON body from the request

    const response = await fetch(`${process.env.BACKEND_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productUpdates), // Send the updates in the request body
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update product')
    }

    const updatedProduct = await response.json()
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
