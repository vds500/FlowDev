
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Wrench, 
  Calendar as CalendarIcon, 
  Users, 
  Settings, 
  Menu, 
  X,
  Bell,
  Search,
  UserCircle,
  Moon,
  Sun,
  Palette,
  Check
} from 'lucide-react';
import Dashboard from './views/Dashboard';
import QuotesList from './views/QuotesList';
import OSList from './views/OSList';
import CalendarView from './views/CalendarView';
import ClientsList from './views/ClientsList';

type View = 'dashboard' | 'quotes' | 'os' | 'calendar' | 'clients';

const COLORS = [
  { name: 'Padrão (Azul)', value: '#2563eb', hover: '#1d4ed8' },
  { name: 'Indigo', value: '#4f46e5', hover: '#4338ca' },
  { name: 'Esmeralda', value: '#059669', hover: '#047857' },
  { name: 'Rosa', value: '#e11d48', hover: '#be123c' },
  { name: 'Âmbar', value: '#d97706', hover: '#b45309' },
  { name: 'Violeta', value: '#7c3aed', hover: '#6d28d9' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(COLORS[0]);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);

  // Apply CSS Variables for dynamic colors
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor.value);
    document.documentElement.style.setProperty('--primary-color-hover', primaryColor.hover);
  }, [primaryColor]);

  // Sincroniza o modo escuro com a tag HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === view 
          ? 'bg-primary text-white shadow-md' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
      }`}
    >
      <Icon size={20} />
      {isSidebarOpen && <span className="font-medium">{label}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-theme">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-20 shadow-sm`}
        >
          <div className="p-6 flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white shadow-lg shadow-primary/20">
              <Wrench size={24} />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">FlowDev</span>
            )}
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="quotes" icon={FileText} label="Orçamentos" />
            <NavItem view="os" icon={Wrench} label="Ordens de Serviço" />
            <NavItem view="calendar" icon={CalendarIcon} label="Calendário" />
            <NavItem view="clients" icon={Users} label="Clientes" />
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <button 
              onClick={() => setIsThemePanelOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Palette size={20} />
              {isSidebarOpen && <span className="font-medium">Personalizar</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Settings size={20} />
              {isSidebarOpen && <span className="font-medium">Configurações</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 transition-theme">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400"
              >
                <Menu size={20} />
              </button>
              <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                <Search size={16} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar..." 
                  className="bg-transparent border-none outline-none text-sm w-48 text-slate-600 dark:text-slate-300 placeholder-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 transition-colors"
                title={isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Admin</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Administrador</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                  <UserCircle size={28} className="text-slate-400" />
                </div>
              </div>
            </div>
          </header>

          {/* View Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 transition-theme">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'quotes' && <QuotesList />}
            {currentView === 'os' && <OSList />}
            {currentView === 'calendar' && <CalendarView />}
            {currentView === 'clients' && <ClientsList />}
          </div>
        </main>
      </div>

      {/* Theme Customization Panel */}
      {isThemePanelOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-[10px]">Configurações de Interface</h3>
              <button onClick={() => setIsThemePanelOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-8">
              {/* Mode Toggle */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Aparência</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setIsDarkMode(false)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all ${!isDarkMode ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <Sun size={18} /> <span className="text-xs font-bold">Claro</span>
                  </button>
                  <button 
                    onClick={() => setIsDarkMode(true)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all ${isDarkMode ? 'border-primary bg-primary text-white' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <Moon size={18} /> <span className="text-xs font-bold">Escuro</span>
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Cor do Menu</h4>
                <div className="grid grid-cols-3 gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setPrimaryColor(color)}
                      className={`h-12 rounded-xl flex items-center justify-center transition-all ${primaryColor.value === color.value ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-slate-900 scale-105 shadow-lg' : 'hover:scale-105 hover:opacity-90'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {primaryColor.value === color.value && <Check className="text-white" size={20} />}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setIsThemePanelOpen(false)}
                className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-primary/30 transition-all hover:opacity-95 active:scale-95"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
