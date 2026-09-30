import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(String(razorpay_signature));
    const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!ok) return NextResponse.json({ verified: false }, { status: 400 });

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error("verify failed", err);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}
