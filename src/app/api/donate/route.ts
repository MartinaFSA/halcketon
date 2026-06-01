import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { mp } from "@/lib/mercadopago";

// Receives the donation form POST, creates a MercadoPago "Preference"
// (a one-time payment intent), and redirects the donor to Checkout Pro.
export async function POST(request: Request) {
  const form = await request.formData();

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const amount = Number(form.get("amount"));

  // Basic server-side validation — never trust the client's HTML constraints.
  if (!email || !Number.isFinite(amount) || amount < 100) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos: revisá el email y el monto (mínimo 100)." },
      { status: 400 }
    );
  }

  // Where MercadoPago sends the donor back after paying. MP can't reach
  // localhost, and it rejects `auto_return` with a localhost back_url — so we
  // only attach return URLs when running on a real public host.
  const origin = new URL(request.url).origin;
  const isLocal = /localhost|127\.0\.0\.1/.test(origin);

  try {
    const preference = new Preference(mp);
    const result = await preference.create({
      body: {
        items: [
          {
            id: "donation",
            title: "Donación",
            quantity: 1,
            unit_price: amount,
            currency_id: "ARS",
          },
        ],
        payer: { name, email },
        // Where MP sends payment notifications. Skipped on localhost (MP can't
        // reach it); set MP_WEBHOOK_URL to an ngrok/public URL to test webhooks.
        ...(process.env.MP_WEBHOOK_URL
          ? { notification_url: process.env.MP_WEBHOOK_URL }
          : {}),
        ...(isLocal
          ? {}
          : {
              back_urls: {
                success: `${origin}/donate/success`,
                failure: `${origin}/donate/failure`,
                pending: `${origin}/donate/pending`,
              },
              auto_return: "approved",
            }),
        // Lets the webhook (next step) tie a payment back to your records.
        metadata: { donor_email: email, donor_name: name },
      },
    });

    // In TEST mode use sandbox_init_point; production uses init_point.
    const checkoutUrl = result.sandbox_init_point ?? result.init_point;
    if (!checkoutUrl) {
      return NextResponse.json(
        { ok: false, error: "MercadoPago no devolvió una URL de checkout." },
        { status: 502 }
      );
    }

    // 303 forces the browser to GET the checkout URL after the POST.
    return NextResponse.redirect(checkoutUrl, { status: 303 });
  } catch (err) {
    // Surface MP's real error instead of a bare 500.
    console.error("[donate] MercadoPago error:", err);
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
