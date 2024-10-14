import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: { params: { adminId: string } }) {
  try {
    const { adminId } = params
    const body = await request.json()
    const response = await fetch(`http://localhost:3001/api/admin/admins/${adminId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update admin')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 })
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