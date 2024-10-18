import { NextRequest,NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
export async function GET(req:NextRequest){
    revalidatePath("/")
    const response= await  fetch(`${process.env.BACKEND_URL}/stats`, {
        method: "GET"
    })

    if(!response.ok){
        throw new Error("Error Fetching the stats")
    }
    const data= await response.json()
    return NextResponse.json(data, {status: 200})

}