
export enum QuoteStatus {
  Draft = 'Rascunho',
  Sent = 'Enviado',
  Approved = 'Aprovado',
  Rejected = 'Rejeitado',
  Cancelled = 'Cancelado'
}

export enum OSStatus {
  Open = 'Aberta',
  Scheduled = 'Agendada',
  InProgress = 'Em Execução',
  WaitingParts = 'Aguardando Peça',
  WaitingApproval = 'Aguardando Aprovação',
  Completed = 'Concluída',
  Cancelled = 'Cancelada'
}

export enum Priority {
  Low = 'Baixa',
  Medium = 'Média',
  High = 'Alta',
  Urgent = 'Urgente'
}

export enum RecurrenceType {
  None = 'Nenhuma',
  Monthly = 'Mensal',
  Bimonthly = 'Bimestral',
  Quarterly = 'Trimestral',
  Semiannual = 'Semestral',
  Annual = 'Anual',
  Custom = 'Personalizado'
}

export enum ClientType {
  PF = 'Pessoa Física',
  PJ = 'Pessoa Jurídica'
}

export enum ClientStatus {
  Active = 'Ativo',
  Inactive = 'Inativo'
}

export interface Client {
  id: string;
  type: ClientType;
  status: ClientStatus;
  name: string; // Full Name or Reason Social
  fantasyName?: string;
  document: string; // CPF or CNPJ
  contactPerson?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  birthDate?: string; // For PF
  rg?: string; // For PF
  cep: string;
  city: string;
  uf: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  lastContact?: string;
  notes?: string;
}

export interface ServiceItem {
  id: string;
  type: 'Produto' | 'Serviço';
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Quote {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  expiryDate: string;
  status: QuoteStatus;
  salesperson: string;
  paymentMethod: string;
  items: ServiceItem[];
  totalValue: number;
  preventiveEnabled: boolean;
  preventiveFrequency?: number; // months
  nextPreventiveDate?: string;
}

export interface OS {
  id: string;
  number: string;
  quoteId?: string;
  clientId: string;
  clientName: string;
  equipment?: string;
  description: string; // Problem description
  priority: Priority;
  status: OSStatus;
  salesperson: string;
  technician: string;
  openDate: string;
  openTime: string;
  forecastDate: string;
  completionDate?: string;
  startTime?: string;
  endTime?: string;
  executionReport?: string;
  totalValue: number;
  items: ServiceItem[];
  checklist?: Record<string, any>;
  paymentMethod?: string;
  observations?: string;
  // Recurrence Fields
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceValue?: number; // X days/months
  recurrenceUnit?: 'Dias' | 'Meses';
  nextExecutionDate?: string;
  repetitionCount?: number; // null for unlimited
  copyItemsToNext?: boolean;
  recurrenceNotes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'OS' | 'Preventive';
  status: OSStatus | 'PreventivePending';
  priority: Priority;
  relatedId: string;
}
