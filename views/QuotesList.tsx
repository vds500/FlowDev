
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Share2, 
  FileCheck,
  Calendar,
  DollarSign,
  User,
  Eye,
  Copy,
  Trash2,
  ChevronDown,
  X
} from 'lucide-react';
import { Quote, QuoteStatus } from '../types';
import QuoteForm from './QuoteForm';

const MOCK_QUOTES: Quote[] = [
  {
    id: '1',
    number: '000123',
    clientId: 'c1',
    clientName: 'João Silva Ltda',
    issueDate: '2025-02-01',
    expiryDate: '2025-02-15',
    status: QuoteStatus.Draft,
    salesperson: 'Maria Souza',
    paymentMethod: 'Boleto 30 dias',
    items: [],
    totalValue: 4850.00,
    preventiveEnabled: true,
    preventiveFrequency: 6
  },
  {
    id: '2',
    number: '000124',
    clientId: 'c1',
    clientName: 'Supermercado Nova Era',
    issueDate: '2025-01-10',
    expiryDate: '2025-01-20',
    status: QuoteStatus.Approved,
    salesperson: 'Ricardo Souza',
    paymentMethod: 'Boleto 30 dias',
    items: [],
    totalValue: 12500.00,
    preventiveEnabled: true,
    preventiveFrequency: 6
  }
];

const QuotesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const getStatusStyle = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.Approved: return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case QuoteStatus.Draft: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case QuoteStatus.Sent: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  if (isFormOpen) {
    return <QuoteForm onBack={() => setIsFormOpen(false)} quoteToEdit={selectedQuote} />;
  }

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all text-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Orçamentos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie suas propostas comerciais.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:opacity-95 transition-all shadow-md shadow-primary/20"
        >
          <Plus size={18} /> Novo Orçamento
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-theme">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Pesquisar..." className={inputClass} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none dark:text-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>Todos Status</option>
              <option>Aberto</option>
              <option>Aprovado</option>
            </select>
            <button className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors text-sm">
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-theme">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nº</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_QUOTES.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-primary">#{quote.number}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 text-sm">{quote.clientName}</td>
                  <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">{new Date(quote.issueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-black text-slate-800 dark:text-white">{quote.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setSelectedQuote(quote); setIsFormOpen(true); }} className="p-2 text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuotesList;
