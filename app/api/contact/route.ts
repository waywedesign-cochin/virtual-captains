import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, website, audience, role, employees } = body;

    // Message is optional (matches the Book a Call popup)
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    // Log payload for tracking
    console.log("[Contact Form Submission]:", {
      name,
      email,
      phone,
      audience: audience || "N/A",
      role: role || "N/A",
      employees: employees || "N/A",
      website: website || "N/A",
      message: message || "N/A",
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
