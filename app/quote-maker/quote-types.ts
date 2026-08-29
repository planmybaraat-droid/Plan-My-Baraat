export interface QuoteMakerServiceSelection {
  name: string;
  category: string;
  quantity_or_note: string;
}

export interface QuoteMakerQuote {
  id: string;
  quote_number: string;
  client_name: string;
  event_date: string;
  client_number: string;
  selected_services: QuoteMakerServiceSelection[];
  final_price: number;
  transport_cost: number;
  discount: number;
  grand_total: number;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteMakerQuotePayload {
  id?: string;
  client_name: string;
  event_date: string;
  client_number: string;
  selected_services: QuoteMakerServiceSelection[];
  final_price: number;
  transport_cost: number;
  discount: number;
  valid_until: string;
}
