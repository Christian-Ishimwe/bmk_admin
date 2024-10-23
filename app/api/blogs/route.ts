import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
export async function GET(req: NextRequest) {
    revalidatePath(req.nextUrl.pathname)
    try{
        const response = await fetch(`${process.env.BACKEND_URL}/blogs`)
        const data = await response.json()
        if(!response.ok){
            throw new Error(data.message)}
        return NextResponse.json(data)
    }catch(e){
        console.error(e)
        return NextResponse.error()
    }
}

export async function POST(req: NextRequest) {
  try {
    const postData = await req.json(); 
    console.log(postData); 
    const response = await fetch(`${process.env.BACKEND_URL}/blogs`, {
      method: 'POST',
      body: JSON.stringify(postData), // Sending post data to another service
      headers: {
        'Content-Type': 'application/json', // Ensure request header is set for JSON
      },
    });

    const data = await response.json(); // Parsing response from backend
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message); // If response is not OK, throw an error
    }

    return NextResponse.json(data, {status: 201}); // Return successful response
  } catch (e) {
    console.error(e);
    return NextResponse.json({message: "Internal server error, please try again"}, {status:500});
  }
}
