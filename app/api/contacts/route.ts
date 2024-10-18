import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const response= await fetch(`${process.env.BACKEND_URL}/contacts`)
        if(!response.ok){
            throw new Error("Error fetching the messages")
        }
        const data= await response.json()
        return NextResponse.json(data, {status: 200})
    }catch(err){
        console.log(err)
        return NextResponse.json({message: "Error fethcing the messages"}, {status: 500})
    }
}

export async function DELETE(req: NextRequest){
    try{
        const {id}= await req.json()
        const response= await fetch(`${process.env.BACKEND_URL}/contacts`, 
            {
                method: "DELETE",
                body: JSON.stringify({id})
            }
        )
        if(!response.ok){
            throw new Error("There was an error deleting the message")
        }
        return NextResponse.json({message: "Message deleted Successful"})
    }catch(err){
        console.log(err)
        return NextResponse.json({message: "There was any error deleting message"}, {status: 500})
    }
}
export async function POST(req: NextRequest){
    try{
        const {contactId, replyMessage}= await req.json()
        const response= await fetch(`${process.env.BACKEND_URL}/contacts`, {
            method: 'POST',
            body: JSON.stringify({contactId, replyMessage})
        })
        if(!response.ok){
            return NextResponse.json({message: "Their was error sending reply"}, {status: 400})
        }
        return NextResponse.json({message: "Reply sent successful"})
    }catch(err){
        console.log(err)
    }
}