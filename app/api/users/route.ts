import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/users?page=${page}&limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
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


export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { userId, plan } = body

    const response = await fetch(`${process.env.BACKEND_URL}/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({plan, userId}),
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


