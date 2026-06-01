import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { mp } from "@/lib/mercadopago";
import { savePayment } from "@/lib/donationsStore";
import type { PaymentStatus } from "@/types/payment";

// MercadoPago calls this server-to-server when a payment changes state.
// IMPORTANT: MP does NOT send the amount/status in the body — only an id.
// We must fetch the real payment from MP's API and trust THAT, never the body.
export async function POST(request: Request) {
  // MP sends the payment id either as ?id= / ?data.id= or in the JSON body.
  const url = new URL(request.url);
  let paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

  if (!paymentId) {
    const body = await request.json().catch(() => null);
    paymentId = body?.data?.id ?? body?.id ?? null;
  }

  if (!paymentId) {
    // Ack anyway so MP doesn't retry forever on a malformed/ping call.
    return NextResponse.json({ ok: true, note: "no payment id" });
  }

  try {
    const payment = await new Payment(mp).get({ id: paymentId });

    await savePayment({
      mercadopago_id: String(payment.id),
      amount: payment.transaction_amount ?? 0,
      status: (payment.status as PaymentStatus) ?? "pending",
      paid_at: payment.date_approved ?? undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook] failed to process payment", paymentId, err);
    // Return 500 so MP retries — a transient fetch failure shouldn't lose data.
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
