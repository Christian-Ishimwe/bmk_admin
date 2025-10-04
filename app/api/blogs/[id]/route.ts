import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params:Promise<{id: string}> }) {
    try{
        const { id } = await params
        const response = await fetch(`${process.env.BACKEND_URL}/blogs/${id}`, { method: 'GET' })
        const data = await response.json()
        if(!response.ok){
            throw new Error(data.message)}
        return NextResponse.json(data)
    }catch(e){
        console.error(e)
        return NextResponse.error()
    }
}




export async function DELETE(req: NextRequest, { params }: { params:Promise<{id: string}> }) {
    try{
        const { id } = await params
        const response = await fetch(`${process.env.BACKEND_URL}/blogs/${id}`, { method: 'DELETE' })
        const data = await response.json()
        if(!response.ok){
            throw new Error(data.message)}
        return NextResponse.json(data)
    }catch(e){
        console.error(e)
        return NextResponse.error()
    }
}


export async function PUT(req: NextRequest, { params }: { params: Promise<{id: string}> }) {
    try{
        const { id } = await params
        const postData = await req.json()
        console.log(postData)
        const response = await fetch(`${process.env.BACKEND_URL}/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(postData)
        })
        const data = await response.json()
        if(!response.ok){
            throw new Error(data.message)}
        return NextResponse.json(data)
    }catch(e){
        console.error(e)
        return NextResponse.error()
    }
}