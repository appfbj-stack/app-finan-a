import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  History as HistoryIcon, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  PieChart as PieChartIcon,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

import { Transaction, ViewState, DEFAULT_CATEGORIES } from './types';
import { loadTransactions, saveTransactions } from './services/storage';
import { TransactionModal } from './components/TransactionModal';
import { Card } from './components/ui/Card';
import { LandingPage } from './components/LandingPage';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [view, setView] = useState<ViewState>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Load initial data and check intro state
  useEffect(() => {
    const loadedTx = loadTransactions();
    setTransactions(loadedTx);
    
    // Check if user has already seen the intro or has transactions
    const hasSeenIntro = localStorage.getItem('financa_facil_intro_seen');
    if (hasSeenIntro === 'true' && loadedTx.length > 0) {
      setShowLanding(false);
    }
  }, []);

  // Save data on change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Derived State (Calculations)
  const totals = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.income += curr.amount;
      } else {
        acc.expenses += curr.amount;
      }
      return acc;
    }, { income: 0, expenses: 0 });
  }, [transactions]);

  const balance = totals.income - totals.expenses;

  const expensesByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const catName = DEFAULT_CATEGORIES.find(c => c.id === t.category)?.name || t.category;
        data[catName] = (data[catName] || 0) + t.amount;
      });
    
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  // Handlers
  const handleEnterApp = () => {
    setShowLanding(false);
    localStorage.setItem('financa_facil_intro_seen', 'true');
  };

  const handleLogout = () => {
    setShowLanding(true);
    setView('dashboard');
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [...prev, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(dateStr));
  };

  // --- VIEWS ---

  if (showLanding) {
    return <LandingPage onEnter={handleEnterApp} />;
  }

  const renderDashboard = () => (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
        <p className="text-slate-400 text-sm font-medium mb-1">Saldo Total</p>
        <h1 className="text-4xl font-bold tracking-tight mb-6">{formatCurrency(balance)}</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1 text-emerald-400">
              <TrendingUp size={16} />
              <span className="text-xs font-semibold uppercase">Entradas</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(totals.income)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1 text-red-400">
              <TrendingDown size={16} />
              <span className="text-xs font-semibold uppercase">Saídas</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(totals.expenses)}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      {expensesByCategory.length > 0 && (
        <Card>
          <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
            <PieChartIcon size={20} className="text-blue-500" />
            Gastos por Categoria
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEFAULT_CATEGORIES.find(c => c.name === entry.name)?.color || '#94a3b8'} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <div>
        <h3 className="text-slate-800 font-bold mb-4 px-1">Atividade Recente</h3>
        <div className="space-y-3">
          {recentTransactions.slice(0, 5).map(t => (
            <Card key={t.id} className="flex items-center justify-between !py-3 active:scale-[0.99] transition-transform">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {t.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{t.description}</p>
                  <p className="text-xs text-slate-500 capitalize">{DEFAULT_CATEGORIES.find(c => c.id === t.category)?.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
                <p className="text-xs text-slate-400">{formatDate(t.date)}</p>
              </div>
            </Card>
          ))}
          {recentTransactions.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              Nenhuma transação registrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="pb-24 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 px-1">Histórico</h2>
      <div className="space-y-3">
        {recentTransactions.map(t => (
          <div 
            key={t.id} 
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-2 h-10 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="font-bold text-slate-800">{t.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{formatDate(t.date)}</span>
                  <span>•</span>
                  <span>{DEFAULT_CATEGORIES.find(c => c.id === t.category)?.name}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </p>
              <button 
                onClick={() => handleDeleteTransaction(t.id)}
                className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
        {recentTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <HistoryIcon size={48} className="mb-4 opacity-20" />
            <p>Seu histórico está vazio.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="pb-24 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 px-1">Ajustes</h2>
      
      <div className="space-y-4">
        <Card className="!p-0 overflow-hidden">
             <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 p-2 rounded-full text-red-500">
                    <LogOut size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-700">Sair do App</p>
                    <p className="text-xs text-slate-500">Voltar para a tela de apresentação</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-400" />
              </button>
        </Card>
        
        <div className="text-center mt-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-2">
                <Wallet className="text-slate-400" size={24} />
            </div>
            <p className="text-slate-900 font-bold">Finança Fácil</p>
            <p className="text-xs text-slate-400">Versão 1.0.1</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-200 px-4 py-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Wallet className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">Finança Fácil</span>
          </div>
          <button 
            onClick={() => setView('settings')}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            U
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-md mx-auto min-h-screen">
        {view === 'dashboard' && renderDashboard()}
        {view === 'history' && renderHistory()}
        {view === 'settings' && renderSettings()}
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/40 hover:bg-emerald-600 active:scale-90 transition-all duration-200 md:right-[calc(50%-220px+1rem)]"
      >
        <Plus size={28} />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 z-40 pb-safe">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${view === 'dashboard' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Home size={24} strokeWidth={view === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Início</span>
          </button>

          <button 
            onClick={() => setView('history')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${view === 'history' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <HistoryIcon size={24} strokeWidth={view === 'history' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Histórico</span>
          </button>

          <button 
            onClick={() => setView('settings')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${view === 'settings' ? 'text-slate-800 bg-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Settings size={24} strokeWidth={view === 'settings' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Ajustes</span>
          </button>
        </div>
      </nav>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddTransaction} 
      />
    </div>
  );
}

export default App;