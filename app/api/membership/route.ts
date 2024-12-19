import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from 'next/cache'

export async function GET(req: NextRequest) {
  revalidatePath(req.url)
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/membership`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Subscription");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Subscriptions:", error);
    return NextResponse.json({ error: "Failed to fetch Subscriptions" }, { status: 500 });
  }
}
