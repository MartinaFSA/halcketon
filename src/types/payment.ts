export type PaymentStatus =
  | "pending"
  | "approved"
  | "authorized"
  | "in_process"
  | "rejected"
  | "cancelled"
  | "refunded";

export interface Payment {
  id: string;
  donor_id: string;
  amount: number;
  status: PaymentStatus;
  mercadopago_id?: string;
  paid_at?: string;
  created_at?: string;
}
