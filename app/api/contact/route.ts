import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, website } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Name, email, phone, and message are required." },
        { status: 400 }
      );
    }

    // Log payload for tracking
    console.log("[Contact Form Submission]:", {
      name,
      email,
      phone,
      website: website || "N/A",
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Message received successfully. A Captain will reach out within 1 business day.",
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      { error: "Failed to process contact submission." },
      { status: 500 }
    );
  }
}
