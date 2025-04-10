export type P2PTrade = {
  id: number;
  advertisement_id: number;
  converstaion_id: number;
  maker_id: number;
  taker_id: number;
  price: string;
  amount: string;
  state: string;
  side: string;
  taker_locked: string;
  maker_accepted_at: string;
  taker_accepted_at: string;
  maker_seen_at: string;
  taker_seen_at: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
}

export type ConversationMessage = {
  id: number;
  member_id: number;
  conversation_id: number;
  body?: string;
  filename?: string;
  support_message?: boolean;
  created_at: string;
  updated_at: string;
}