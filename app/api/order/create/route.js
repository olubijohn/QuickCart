import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {userId} = getAuth(request)
        const {address, items} = await request.json()
        if(!address, items.length === 0) {
            return NextResponse.json({success: false, message: "Invalid Data"})
        }
        // calculate amount
        const amount = items.map(async (total, item)=> {
            const product = Product.findById(item.product)
            return await total + (product.offerPrice * item.quantity)
        },0)
        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.02),
                date: Date.now()
            }
        })
        // clear user cart data
        const user = await User.findById(userId)
        user.cartItems = {}
        user.save()

        return NextResponse.josn({success: true, message: "Order Placed"})
    } catch (error) {
        console.log(error);
        return NextResponse.josn({success: false, message: error.message})
        
    }
}