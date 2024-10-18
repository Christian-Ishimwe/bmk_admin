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

export async function PUT(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params
    const {status}= await request.json()
    const response = await fetch(`${process.env.BACKEND_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({status})
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to Update the status')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating the status', error)
    return NextResponse.json({ error: 'To update the status' }, { status: 500 })
  }
  
}
