export interface Payment {
  id: number;
  payment_type: string;
  state: string;
  account_name: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}
