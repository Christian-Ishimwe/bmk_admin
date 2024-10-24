import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const products = parseInt(searchParams.get('limit') || '10', 10)
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/orders?page=${page}&limit=${products}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Orders, Please try again')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Orders:', error)
    return NextResponse.json({ error: 'Failed to fetch Orders, Try again' }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const response = await fetch(`${process.env.BACKEND_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create user')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    //@ts-ignore
    const message= error.message
    console.log()
    return NextResponse.json({ error: message}, { status: 500 })
  }
}


