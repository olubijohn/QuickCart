import { inngest } from "@/config/inngest";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
    try {
        await connectDB(); // Ensure DB connection!
        const {userId} = getAuth(request)
        const {address, items} = await request.json()
        if (!address || !items || items.length === 0) {
            return NextResponse.json({success: false, message: "Invalid Data"})
        }
        // calculate amount
        let amount = 0;
        for (const item of items) {
            console.log("Looking for product:", item.product, typeof item.product);
            let product;
            try {
                product = await Product.findById(new mongoose.Types.ObjectId(item.product));
            } catch (e) {
                // If the ID is not a valid ObjectId, skip or handle error
                return NextResponse.json({success: false, message: `Invalid product ID: ${item.product}`});
            }
            if (!product) {
                console.log("NOT FOUND:", item.product);
                return NextResponse.json({success: false, message: `Product not found for ID: ${item.product}`});
            }
            amount += product.offerPrice * item.quantity;
        }
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
        await user.save()

        return NextResponse.json({success: true, message: "Order Placed"})
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: error.message})
    }
}