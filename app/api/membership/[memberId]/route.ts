import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ memberId: string }> }) {
    try{
        const {memberId}=await params
        const response = await fetch(`${process.env.BACKEND_URL}/membership/${memberId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(!response.ok){
            throw new Error("Failed to delete Subscription")
        }
        return NextResponse.json({message: "Subscription deleted successful"})
    }
    catch(err:any){
        console.error("Internal Server error: ", err)
        return NextResponse.json({message: "Internal Server error"}, {status: 500})
    }
}

