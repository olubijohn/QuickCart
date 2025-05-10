import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {cartData} = await request.json()
        const {userId} = getAuth(request)

        await connectDB()
        const user = await User.findById(userId)
        user.cartItems = cartData
        user.save()
        return NextResponse.json({success: true})
    }catch(error) {
        return NextResponse.json({success: false, message: error.message})
    }
}