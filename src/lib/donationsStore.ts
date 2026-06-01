import { supabaseAdmin } from "@/lib/server";
import type { Payment } from "@/types/payment";

// Supabase-backed donations store. Uses the service-role client so it works
// from the webhook (no authenticated user) despite RLS. Same signatures as the
// previous file-based stand-in, so callers (the webhook) are unchanged.

export async function getPayments(): Promise<Payment[]> {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Payment[];
}

// Idempotent on mercadopago_id: MP fires the webhook multiple times per payment.
// We update the existing row if present, otherwise insert. The DB generates the
// uuid `id` and timestamps — we never pass the MP id as the primary key.
export async function savePayment(
  payment: Pick<Payment, "amount" | "status" | "mercadopago_id" | "paid_at">
): Promise<void> {
  const { data: existing, error: selErr } = await supabaseAdmin
    .from("payments")
    .select("id")
    .eq("mercadopago_id", payment.mercadopago_id)
    .maybeSingle();
  if (selErr) throw selErr;

  const row = {
    amount: payment.amount,
    status: payment.status,
    mercadopago_id: payment.mercadopago_id,
    paid_at: payment.paid_at ?? null,
    donor_id: null, // linkage deferred until donors are wired in
  };

  if (existing) {
    const { error } = await supabaseAdmin
      .from("payments")
      .update(row)
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from("payments").insert(row);
    if (error) throw error;
  }
}
