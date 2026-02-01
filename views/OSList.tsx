
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Wrench, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Download, 
  ChevronDown, 
  Eye, 
  Copy, 
  Trash2, 
  FileEdit, 
  MoreHorizontal 
} from 'lucide-react';
import { OS, OSStatus, Priority } from '../types';
import OSForm from './OSForm';

const MOCK_OS: OS[] = [
  {
    id: '1',
    number: '000456',
    clientId: 'c1',
    clientName: 'João Silva Ltda',
    equipment: 'Fogão Industrial 6 Bocas',
    description: 'Troca de termostato e limpeza geral',
    priority: Priority.High,
    status: OSStatus.InProgress,
    salesperson: 'Fabiana Melo',
    technician: 'Pedro Ramos',
    openDate: '2025-02-01',
    openTime: '09:00',
    forecastDate: '2025-02-15',
    totalValue: 2500.00,
    items: [],
    isRecurring: false
  },
  {
    id: '2',
    number: '000457',
    clientId: 'c4',
    clientName: 'Escola Municipal Castelo',
    equipment: 'Ar Condicionado Central',
    description: 'Manutenção Preventiva Semestral',
    priority: Priority.Medium,
    status: OSStatus.Scheduled,
    salesperson: 'Ricardo Souza',
    technician: 'Davi Mendes',
    openDate: '2025-01-19',
    openTime: '10:30',
    forecastDate: '2025-01-22',
    totalValue: 1200.00,
    items: [],
    isRecurring: false
  },
  {
    id: '3',
    number: '000458',
    clientId: 'c5',
    clientName: 'Clínica Life',
    equipment: 'Autoclave Mod 40L',
    description: 'Vazamento na porta frontal - Urgente',
    priority: Priority.Urgent,
    status: OSStatus.Open,
    salesperson: 'Juliana Lima',
    technician: 'Pedro Ramos',
    openDate: '2025-01-20',
    openTime: '08:15',
    forecastDate: '2025-01-20',
    totalValue: 320.00,
    items: [],
    isRecurring: false
  }
];

const OSList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [periodFilter, setPeriodFilter] = useState('Mês Atual');
  const [technicianFilter, setTechnicianFilter] = useState('Todos');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOS, setSelectedOS] = useState<OS | null>(null);

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case Priority.Urgent: return 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20';
      case Priority.High: return 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20';
      case Priority.Medium: return 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50';
    }
  };

  const getStatusBadge = (status: OSStatus) => {
    switch (status) {
      case OSStatus.Completed: return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case OSStatus.InProgress: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case OSStatus.Open: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case OSStatus.Scheduled: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      case OSStatus.Cancelled: return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  if (isFormOpen) {
    return <OSForm onBack={() => setIsFormOpen(false)} osToEdit={selectedOS} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Ordens de Serviço</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie o fluxo de trabalho técnico e execuções.</p>
        </div>
        <button 
          onClick={() => { setSelectedOS(null); setIsFormOpen(true); }}
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:opacity-95 transition-all shadow-md shadow-primary/20"
        >
          <Plus size={18} /> Nova Ordem de Serviço
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-theme">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar por número, cliente, técnico..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all text-sm placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors text-sm whitespace-nowrap">
            <Download size={18} /> Exportar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
            <div className="relative">
              <select 
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white transition-theme"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>Todos</option>
                <option>Aberta</option>
                <option>Em Execução</option>
                <option>Aguardando Peças</option>
                <option>Concluída</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Período</label>
            <div className="relative">
              <select 
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white transition-theme"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
              >
                <option>Mês Atual</option>
                <option>Hoje</option>
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Técnico</label>
            <div className="relative">
              <select 
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary dark:text-white transition-theme"
                value={technicianFilter}
                onChange={(e) => setTechnicianFilter(e.target.value)}
              >
                <option>Todos</option>
                <option>Pedro Ramos</option>
                <option>Davi Mendes</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-theme">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-theme">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nº OS</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Abertura</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Valor</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_OS.map((os) => (
                <tr key={os.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary">#{os.number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{new Date(os.openDate).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{os.clientName}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border w-fit mt-1 ${getPriorityStyle(os.priority)}`}>
                        {os.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-slate-800 dark:text-white">
                      {os.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(os.status)}`}>
                      {os.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button 
                        onClick={() => { setSelectedOS(os); setIsFormOpen(true); }}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                    <div className="group-hover:hidden">
                       <MoreHorizontal size={16} className="text-slate-300 dark:text-slate-600 ml-auto" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest transition-theme">
          <span>Mostrando {MOCK_OS.length} de 45 ordens de serviço</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-30" disabled>Anterior</button>
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OSList;
