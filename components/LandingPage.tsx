import React from 'react';
import { Wallet, TrendingUp, ShieldCheck, ChevronRight, PieChart } from 'lucide-react';
import { Button } from './ui/Button';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full animate-fade-in-up">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
            <Wallet className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Finança Fácil</span>
        </div>
        <button 
          onClick={onEnter}
          className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
        >
          Entrar
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-12 lg:py-20 max-w-6xl mx-auto w-full gap-12">
        
        {/* Text Content */}
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 animate-fade-in-up">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Controle Financeiro Simplificado</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight animate-fade-in-up delay-100">
            Seu dinheiro <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">sob controle.</span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-lg animate-fade-in-up delay-200">
            Abandone as planilhas complicadas. Registre gastos, acompanhe seu saldo e visualize para onde seu dinheiro vai com gráficos intuitivos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-300">
            <Button 
              onClick={onEnter} 
              className="py-4 text-lg shadow-xl shadow-emerald-500/30 hover:scale-105 transition-transform"
            >
              Começar Agora
              <ChevronRight size={20} />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-slate-400 pt-4 animate-fade-in-up delay-300">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
            </div>
            <p>Junte-se a milhares de usuários organizados.</p>
          </div>
        </div>

        {/* Visual / Illustration */}
        <div className="lg:w-1/2 relative flex justify-center items-center animate-fade-in-up delay-200">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/50 to-blue-100/50 rounded-full blur-3xl opacity-70 animate-pulse"></div>
          
          <div className="relative w-full max-w-md aspect-square animate-float">
            {/* Abstract App Representation */}
            <div className="absolute inset-4 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 flex flex-col justify-between overflow-hidden">
              
              {/* Fake Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="w-12 h-12 rounded-full bg-slate-100"></div>
                <div className="space-y-2">
                  <div className="w-24 h-2 bg-slate-100 rounded"></div>
                  <div className="w-16 h-2 bg-slate-100 rounded"></div>
                </div>
              </div>

              {/* Fake Chart */}
              <div className="flex justify-center mb-8">
                <div className="w-40 h-40 rounded-full border-[16px] border-emerald-500 border-r-emerald-200 border-b-blue-400 transform -rotate-45"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-20 right-8 bg-white p-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3 animate-float delay-500">
                <div className="bg-red-100 p-2 rounded-full text-red-500"><TrendingUp size={16} /></div>
                <div>
                  <div className="text-xs text-slate-400">Gasto</div>
                  <div className="font-bold text-slate-800">-R$ 120</div>
                </div>
              </div>

              <div className="absolute bottom-20 left-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-50 flex items-center gap-3 animate-float delay-100">
                <div className="bg-emerald-100 p-2 rounded-full text-emerald-500"><Wallet size={16} /></div>
                <div>
                  <div className="text-xs text-slate-400">Receita</div>
                  <div className="font-bold text-slate-800">+R$ 2.500</div>
                </div>
              </div>
              
              {/* Fake Button */}
              <div className="h-12 w-full bg-slate-900 rounded-xl mt-auto opacity-10"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Por que usar o Finança Fácil?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Tudo o que você precisa para manter a saúde financeira em dia, sem complicações.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="text-blue-500" size={32} />}
              title="Registro Simples"
              description="Adicione suas despesas e receitas em segundos. Categorize tudo e veja para onde seu dinheiro vai."
            />
            <FeatureCard 
              icon={<PieChart className="text-purple-500" size={32} />}
              title="Relatórios Visuais"
              description="Entenda seus hábitos financeiros com gráficos claros e automáticos por categoria."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" size={32} />}
              title="100% Seguro & Offline"
              description="Seus dados ficam salvos no seu dispositivo. O app funciona perfeitamente mesmo sem internet."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">© 2024 Finança Fácil. Simplifique sua vida.</p>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
    <div className="mb-4 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
  </div>
);