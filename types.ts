export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO String
  description: string;
  category: string;
  type: TransactionType;
}

export type ViewState = 'dashboard' | 'history' | 'settings';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Alimentação', icon: 'Utensils', color: '#f59e0b' },
  { id: 'transport', name: 'Transporte', icon: 'Car', color: '#3b82f6' },
  { id: 'bills', name: 'Contas', icon: 'Zap', color: '#ef4444' },
  { id: 'leisure', name: 'Lazer', icon: 'Gamepad2', color: '#8b5cf6' },
  { id: 'health', name: 'Saúde', icon: 'Heart', color: '#ec4899' },
  { id: 'income', name: 'Renda', icon: 'Wallet', color: '#10b981' },
  { id: 'other', name: 'Outros', icon: 'Circle', color: '#64748b' },
];