import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/settings?adminId=${adminId}`);

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to fetch profile data" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    // If there’s an error during the fetch or processing
    return NextResponse.json({ message: "Failed to fetch profile data" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");
  const userdata= await req.json()
  console.log(userdata)
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/settings?adminId=${adminId}`, {
        method: "POST",
        body: JSON.stringify(userdata),
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to Update profile data" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ message: "Failed to Update profile data" }, { status: 500 });
  }
}
