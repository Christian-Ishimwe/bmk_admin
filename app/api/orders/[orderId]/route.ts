import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params
    const response = await fetch(`${process.env.BACKEND_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to Get order')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error Getting the order', error)
    return NextResponse.json({ error: 'Failed to get Order status' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { adminId: string } }) {
  try {
    const { adminId } = params
    const response = await fetch(`http://localhost:3001/api/admin/admins/${adminId}/delete`, {
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