import { inngest } from "@/config/inngest";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order"; // Add this import
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();
        const { userId } = getAuth(request);
        const { address, items, products } = await request.json();
        if (!address || !items || items.length === 0 || !products) {
            return NextResponse.json({ success: false, message: "Invalid Data" });
        }
        // calculate amount using passed products
        let amount = 0;
        for (const item of items) {
            const product = products.find(p => p._id === item.product);
            if (!product) {
                return NextResponse.json({ success: false, message: `Product not found for ID: ${item.product}` });
            }
            amount += product.offerPrice * item.quantity;
        }
        // await inngest.send({
        //     name: "order/created",
        //     data: {
        //         userId,
        //         address,
        //         items,
        //         amount: amount + Math.floor(amount * 0.02),
        //         date: Date.now()
        //     }
        // });
        // clear user cart data
        const user = await User.findById(userId);
        user.cartItems = {};
        await user.save();

        const order = await Order.create({
            userId,
            address,
            items,
            amount: amount + Math.floor(amount * 0.02),
            date: Date.now()
        });

        return NextResponse.json({ success: true, message: "Order Placed", orderId: order._id });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}