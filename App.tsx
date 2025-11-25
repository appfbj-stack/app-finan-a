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
  ChevronRight,
  Download,
  X,
  Share,
  PlusSquare,
  MoreVertical,
  Monitor
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
  
  // PWA State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Load initial data and check intro state
  useEffect(() => {
    const loadedTx = loadTransactions();
    setTransactions(loadedTx);
    
    // Check if user has already seen the intro or has transactions
    const hasSeenIntro = localStorage.getItem('financa_facil_intro_seen');
    if (hasSeenIntro === 'true' && loadedTx.length > 0) {
      setShowLanding(false);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(ios);

    // Detect Standalone (Already Installed)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isInStandaloneMode);
    
    if (isInStandaloneMode) {
      setShowInstallBanner(false);
    }
  }, []);

  // Save data on change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // PWA Install Prompt Handler (Android/Desktop)
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // We don't rely solely on this event anymore to show the banner
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    // Scenario 1: We captured the browser's native prompt (Android/Chrome Desktop)
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      }
      return;
    }

    // Scenario 2: iOS or Browser didn't fire event (Manual Instructions needed)
    setShowInstructions(true);
  };

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
      
      {/* Install Banner (Always visible if not standalone) */}
      {showInstallBanner && !isStandalone && (
        <div className="bg-blue-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Instalar Aplicativo</h3>
              <p className="text-blue-100 text-sm mb-3 leading-relaxed">
                Adicione à tela inicial para usar sem internet e em tela cheia.
              </p>
              <button 
                onClick={handleInstallClick}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-transform"
              >
                Instalar agora
              </button>
            </div>
            <button 
              onClick={() => setShowInstallBanner(false)}
              className="p-1 bg-blue-500/50 rounded-full hover:bg-blue-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          {/* Decor */}
          <div className="absolute -right-4 -bottom-4 bg-white/10 w-24 h-24 rounded-full blur-xl"></div>
        </div>
      )}

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
             {/* Show Settings Install Button if not standalone */}
             {!isStandalone && (
                <button 
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 bg-emerald-50/50 transition-colors border-b border-emerald-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                      <Download size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-700">Instalar Aplicativo</p>
                      <p className="text-xs text-slate-500">Adicionar à tela inicial</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </button>
             )}

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
            <p className="text-xs text-slate-400">Versão 1.1.2</p>
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
            A
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

      {/* Instruction Modal (Generic for both iOS and Android Fallback) */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-800">Instalar Aplicativo</h3>
              <button 
                onClick={() => setShowInstructions(false)}
                className="p-1 bg-slate-100 rounded-full hover:bg-slate-200"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-6">
              
              {/* iOS Instructions */}
              {isIos && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">No iPhone / iPad</p>
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0">1</span>
                    <p>Toque no botão <Share size={16} className="inline mx-1 text-blue-500" /> <strong>Compartilhar</strong> na barra inferior do Safari.</p>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0">2</span>
                    <p>Role para baixo e toque em <PlusSquare size={16} className="inline mx-1" /> <strong>Adicionar à Tela de Início</strong>.</p>
                  </div>
                </div>
              )}

              {/* Android/Chrome Instructions */}
              {!isIos && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">No Android / Chrome</p>
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0">1</span>
                    <p>Toque no menu do navegador <MoreVertical size={16} className="inline mx-1" /> (três pontinhos no canto superior).</p>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0">2</span>
                    <p>Selecione <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>.</p>
                  </div>
                </div>
              )}

               {/* PC/Desktop Instructions */}
               {!isIos && (
                <div className="space-y-4 border-t pt-4">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">No Computador</p>
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0"><Monitor size={16} /></span>
                    <p>Procure pelo ícone de instalação <Download size={16} className="inline mx-1" /> na barra de endereço ou clique no menu e escolha "Instalar Finança Fácil".</p>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full bg-slate-100 text-slate-700 hover:bg-slate-200 py-3 rounded-xl font-semibold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;