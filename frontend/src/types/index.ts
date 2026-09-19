export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category?: string;
  created_at: string;
}

export interface AiReview {
  id: string;
  purchase_request_id: string;
  priority: 'alta' | 'media' | 'baixa';
  summary_text: string;
  generated_at: string;
}

export interface PurchaseRequest {
  id: string;
  item_name: string;
  quantity: number;
  requester_name: string;
  justification: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  supplier_id?: string;
  supplier?: Supplier;
  ai_reviews?: AiReview[];
  created_at: string;
}