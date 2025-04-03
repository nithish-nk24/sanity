import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency } = await req.json();
    console.log("Received request:", req.body);

    const options = {
      amount: amount * 100, // Convert to paisa
      currency,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, order_id: order.id, amount: order.amount });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Payment failed", error }, { status: 500 });
  }
}

