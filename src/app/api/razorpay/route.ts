import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { 
  applySecurityMiddleware, 
  DEFAULT_RATE_LIMITS, 
  errorHandler 
} from "@/lib/api-security";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    // Apply security middleware
    const securityResponse = applySecurityMiddleware(req, {
      rateLimit: DEFAULT_RATE_LIMITS.upload, // Payment operations
      validation: {
        amount: { required: true, type: 'number', min: 1 },
        currency: { required: true, type: 'string', enum: ['INR', 'USD', 'EUR'] }
      },
      enableLogging: true,
      enableCSP: true,
      enableCSRF: true
    });

    if (securityResponse) {
      return securityResponse;
    }

    const { amount, currency } = await req.json();

    // Additional validation
    if (amount <= 0 || amount > 1000000) { // Max 10 lakh INR
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid amount. Amount must be between 1 and 1,000,000" 
        }, 
        { status: 400 }
      );
    }

    const options = {
      amount: amount * 100, // Convert to paisa
      currency,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
      success: true, 
      order_id: order.id, 
      amount: order.amount 
    });
  } catch (error) {
    return errorHandler(error as Error, req);
  }
}

