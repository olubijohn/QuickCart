import connectDB from "@/config/db";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    try {
        const { userId } = getAuth(request);
        await connectDB();
        // Optionally, check if the product belongs to the seller (userId)
        const deleted = await Product.findOneAndDelete({ _id: params.id, userId });
        if (!deleted) {
            return NextResponse.json({ success: false, message: "Product not found or not authorized" });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}