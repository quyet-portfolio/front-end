import connectToMongoDB from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    await connectToMongoDB()
    const { name, email, password } = await request.json()
    const newUser = new User({ name, email, password })
    await newUser.save()
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.log(error)
  }
}
