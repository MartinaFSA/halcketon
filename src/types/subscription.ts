export type SubscriptionStatus =
  | "pending"
  | "authorized"
  | "paused"
  | "cancelled";

export interface Subscription {
  id: string;
  donor_id: string;
  amount: number;
  status: SubscriptionStatus;
  created_at?: string;
  // MercadoPago preapproval id (stored so webhooks can be reconciled).
  mercadopago_id?: string;
}
