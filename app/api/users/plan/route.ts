import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const { plan, userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message || 'Failed to update user' }, { status: response.status });
    }

    const updatedUser = await response.json();
    return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'An error occurred' }, { status: 500 });
  }
}