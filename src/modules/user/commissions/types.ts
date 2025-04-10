export interface Commission {
  id: number;
  currency: string;
  friend_uid: string;
  amount: string;
  total: string;
  reference_type: string
  reference_id: number
  created_at?: string
  updated_at?: string
}