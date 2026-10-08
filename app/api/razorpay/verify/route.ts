import { NextResponse, after } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import {
  BRAND,
  C,
  badge,
  esc,
  footnote,
  getMailConfig,
  heading,
  isEmail,
  layout,
  mailtoLink,
  para,
  row,
  rows,
  sendLeadEmails,
  telLink,
} from "@/app/lib/email";

export const runtime = "nodejs";

// Payment IDs already emailed by this instance, so a repeated verify call
// doesn't send the receipt twice.
const emailed = new Set<string>();

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

    // Receipt + team alert run after the response, so email can never slow
    // down or fail a verified payment.
    after(() =>
      sendPaymentEmails(String(razorpay_order_id), String(razorpay_payment_id)),
    );

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error("verify failed", err);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}

/** Buyer details come from the Razorpay order itself, not the browser. */
async function sendPaymentEmails(orderId: string, paymentId: string) {
  if (emailed.has(paymentId)) return;
  emailed.add(paymentId);

  const mail = getMailConfig("ENROLMENTS_TO_EMAIL");
  if (!mail) return;

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const order = await razorpay.orders.fetch(orderId);
    const notes = (order.notes ?? {}) as Record<string, string>;
    const email = String(notes.email ?? "");
    const name = String(notes.name ?? "");
    const firstName = name.split(" ")[0] || "there";
    const program = notes.programTitle || notes.program || "your program";
    const amount = `₹${(Number(order.amount) / 100).toLocaleString("en-IN")}`;

    const details = rows(`
      ${row("Program", esc(program))}
      ${row("Amount", esc(amount))}
      ${row("Payment ID", esc(paymentId))}
      ${row("Order ID", esc(orderId))}
    `);

    await sendLeadEmails({
      ...mail,
      team: {
        replyTo: isEmail(email) ? email : mail.to[0],
        subject: `New Enrolment: ${program} – ${name}`,
        html: layout(
          `${name} paid ${amount} for ${program}`,
          "New Enrolment",
          `
          ${badge("Payment received")}
          ${heading(esc(program), "16px 0 4px 0")}
          ${para(`${esc(name)} just enrolled and paid online.`, C.muted)}
          ${rows(`
            ${row("Name", esc(name))}
            ${isEmail(email) ? row("Email", mailtoLink(email)) : ""}
            ${notes.phone ? row("Phone", telLink(notes.phone)) : ""}
            ${row("Type", esc(notes.audience ?? "individual"))}
            ${notes.role ? row("Role", esc(notes.role)) : ""}
            ${notes.employees ? row("Employees", esc(notes.employees)) : ""}
            ${notes.message ? row("Message", esc(notes.message)) : ""}
          `)}
          <div style="height:16px;"></div>
          ${details}
          `,
        ),
      },
      confirmation: isEmail(email)
        ? {
            to: email,
            subject: `You're enrolled: ${program}`,
            html: layout(
              `Payment of ${amount} received for ${program}.`,
              "Enrolment confirmed",
              `
              ${badge("Enrolment confirmed")}
              ${heading(`Hi ${esc(firstName)},`)}
              ${para(`Thanks for enrolling with ${BRAND}. We've received your payment, and our team will be in touch with the next steps before your batch starts.`)}
              ${details}
              ${footnote("Keep this email as your payment receipt. Questions? Just reply to it.")}
              `,
            ),
          }
        : undefined,
    });
  } catch (err) {
    console.error("Payment email error:", err);
  }
}
