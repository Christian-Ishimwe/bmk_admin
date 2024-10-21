import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");
  const userdata= await req.json()
  console.log(userdata)
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/settings/password?adminId=${adminId}`, {
        method: "POST",
        body: JSON.stringify(userdata),
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to Your password, Please try again" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ message: "Failed to Your password, Please try again" }, { status: 500 });
  }
}
