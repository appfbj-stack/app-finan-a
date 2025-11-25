import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { DEFAULT_CATEGORIES, Transaction, TransactionType } from '../types';
import { Button } from './ui/Button';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onSave({
      amount: parseFloat(amount),
      description,
      type,
      category,
      date: new Date(date).toISOString(),
    });
    
    // Reset form
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full sm:w-96 rounded-t-3xl sm:rounded-2xl p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Nova Transação</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${type === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-500'}`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${type === 'income' ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-500'}`}
            >
              Receita
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-3xl font-bold text-slate-800 placeholder-slate-300 border-b-2 border-slate-100 focus:border-emerald-500 focus:outline-none py-2 bg-transparent"
              placeholder="0,00"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="Ex: Supermercado"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none"
              >
                {DEFAULT_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <Button type="submit" fullWidth className="mt-4">
            <Check size={20} />
            Salvar
          </Button>
        </form>
      </div>
    </div>
  );
};