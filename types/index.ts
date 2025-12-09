export type PageView = 'home' | 'about' | 'team' | 'blog' | 'privacy';

export interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  state?: string;
  type: string;
  status: 'pendente' | 'lido' | 'em_atendimento';
  notes: string;
  created_at: string;
  ip?: string;
  metadata?: string;
}
