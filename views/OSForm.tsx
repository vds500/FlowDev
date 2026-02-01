
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Printer, 
  Send, 
  Plus, 
  Trash2, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Copy,
  Info,
  Wrench,
  Package,
  Activity,
  ClipboardList,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { OS, OSStatus, Priority, ServiceItem, RecurrenceType } from '../types';

interface OSFormProps {
  onBack: () => void;
  osToEdit?: OS | null;
}

const MOCK_CLIENTS = [
  { id: '1', name: 'João Silva Ltda', document: '12.345.678/0001-90', contact: 'João', phone: '(11) 98888-7777', email: 'joao@silva.com.br' },
  { id: '2', name: 'Supermercado Nova Era', document: '44.555.666/0001-11', contact: 'Sérgio', phone: '(11) 96666-5555', email: 'sergio@novaera.com.br' },
];

const OSForm: React.FC<OSFormProps> = ({ onBack, osToEdit }) => {
  const isEditMode = !!osToEdit?.id;
  const isReadOnly = osToEdit?.status === OSStatus.Completed || osToEdit?.status === OSStatus.Cancelled;

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [osInfo, setOsInfo] = useState({
    number: osToEdit?.number || '',
    openDate: osToEdit?.openDate || new Date().toISOString().split('T')[0],
    openTime: osToEdit?.openTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    forecastDate: osToEdit?.forecastDate || '',
    priority: osToEdit?.priority || Priority.Medium,
    status: osToEdit?.status || OSStatus.Open,
    technician: osToEdit?.technician || 'Admin',
    salesperson: osToEdit?.salesperson || 'Admin',
    paymentMethod: osToEdit?.paymentMethod || 'Pix',
    description: osToEdit?.description || '',
    observations: osToEdit?.observations || '',
    executionReport: osToEdit?.executionReport || '',
    isRecurring: osToEdit?.isRecurring || false,
    recurrenceType: osToEdit?.recurrenceType || RecurrenceType.Monthly,
    recurrenceValue: osToEdit?.recurrenceValue || 1,
    recurrenceUnit: osToEdit?.recurrenceUnit || 'Meses',
    nextExecutionDate: osToEdit?.nextExecutionDate || '',
    repetitionCount: osToEdit?.repetitionCount || 0,
    copyItemsToNext: osToEdit?.copyItemsToNext || true,
    recurrenceNotes: osToEdit?.recurrenceNotes || ''
  });

  const [items, setItems] = useState<ServiceItem[]>(osToEdit?.items || []);
  const [globalDiscount, setGlobalDiscount] = useState(0);

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:text-white transition-colors disabled:bg-slate-100 dark:disabled:bg-slate-900 placeholder-slate-400";

  const calculateNextDate = useCallback(() => {
    if (!osInfo.isRecurring) return;
    let date = new Date(osInfo.openDate);
    switch (osInfo.recurrenceType) {
      case RecurrenceType.Monthly: date.setMonth(date.getMonth() + 1); break;
      case RecurrenceType.Bimonthly: date.setMonth(date.getMonth() + 2); break;
      case RecurrenceType.Quarterly: date.setMonth(date.getMonth() + 3); break;
      case RecurrenceType.Semiannual: date.setMonth(date.getMonth() + 6); break;
      case RecurrenceType.Annual: date.setFullYear(date.getFullYear() + 1); break;
      case RecurrenceType.Custom:
        if (osInfo.recurrenceUnit === 'Dias') date.setDate(date.getDate() + osInfo.recurrenceValue);
        else date.setMonth(date.getMonth() + osInfo.recurrenceValue);
        break;
    }
    const nextDate = date.toISOString().split('T')[0];
    setOsInfo(prev => ({ ...prev, nextExecutionDate: nextDate }));
  }, [osInfo.isRecurring, osInfo.recurrenceType, osInfo.recurrenceValue, osInfo.recurrenceUnit, osInfo.openDate]);

  useEffect(() => {
    calculateNextDate();
  }, [calculateNextDate]);

  useEffect(() => {
    if (osToEdit) {
      setClientSearch(osToEdit.clientName);
      const client = MOCK_CLIENTS.find(c => c.name === osToEdit.clientName);
      if (client) setSelectedClient(client);
    }
  }, [osToEdit]);

  const total = items.reduce((acc, item) => acc + item.total, 0) - globalDiscount;

  const handleAddItem = (type: 'Produto' | 'Serviço') => {
    if (isReadOnly) return;
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), type, description: '', quantity: 1, unitPrice: 0, discount: 0, total: 0 }]);
  };

  const handleUpdateItem = (id: string, field: keyof ServiceItem, value: any) => {
    if (isReadOnly) return;
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        return updated;
      }
      return item;
    }));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{isEditMode ? `Editar OS Nº ${osInfo.number}` : 'Nova Ordem de Serviço'}</h1>
            {isEditMode && <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border bg-primary/10 text-primary border-primary/20">{osInfo.status}</span>}
          </div>
        </div>
      </div>

      <div className={`space-y-6 ${isReadOnly ? 'opacity-80' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-theme">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <User size={20} />
              <h2 className="font-bold uppercase tracking-wider text-sm">Dados do Cliente</h2>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" className={inputClass + " pl-10"} placeholder="Buscar cliente..." value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={selectedClient?.document || ''} className={inputClass + " text-xs bg-slate-100 dark:bg-slate-800 font-mono disabled:opacity-60"} readOnly placeholder="CPF/CNPJ" />
                <input type="text" value={selectedClient?.phone || ''} className={inputClass + " text-xs bg-slate-100 dark:bg-slate-800 font-mono disabled:opacity-60"} readOnly placeholder="Telefone" />
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-theme">
            <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400">
              <ClipboardList size={20} />
              <h2 className="font-bold uppercase tracking-wider text-sm">Informações da OS</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Previsão</label>
                <input type="date" className={inputClass + " text-sm"} value={osInfo.forecastDate} onChange={(e) => setOsInfo({...osInfo, forecastDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">Status</label>
                <div className="relative">
                  <select className={inputClass + " text-sm font-bold text-primary appearance-none"} value={osInfo.status} onChange={(e) => setOsInfo({...osInfo, status: e.target.value as any})}>
                    {Object.values(OSStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RECURRENCE SECTION */}
        <section className={`bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${osInfo.isRecurring ? 'border-emerald-200 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-800'}`}>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${osInfo.isRecurring ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                <RotateCcw size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter">Manutenção Preventiva</h3>
                <p className="text-[10px] text-slate-500 font-medium">Configure visitas periódicas automáticas.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={osInfo.isRecurring} onChange={(e) => setOsInfo({...osInfo, isRecurring: e.target.checked})} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {osInfo.isRecurring && (
            <div className="p-6 bg-emerald-50/20 dark:bg-emerald-950/20 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase mb-2">Periodicidade</label>
                  <select className={inputClass} value={osInfo.recurrenceType} onChange={(e) => setOsInfo({...osInfo, recurrenceType: e.target.value as any})}>
                    {Object.values(RecurrenceType).filter(t => t !== RecurrenceType.None).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase mb-2">Próxima Execução</label>
                  <input type="date" className={inputClass} value={osInfo.nextExecutionDate} onChange={(e) => setOsInfo({...osInfo, nextExecutionDate: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase mb-2">Notas de Manutenção</label>
                  <input type="text" className={inputClass} placeholder="Instruções para o técnico..." value={osInfo.recurrenceNotes} onChange={(e) => setOsInfo({...osInfo, recurrenceNotes: e.target.value})} />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Problem Description */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-theme">
           <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Descrição do Problema / Serviço</label>
           <textarea rows={3} className={inputClass} value={osInfo.description} onChange={(e) => setOsInfo({...osInfo, description: e.target.value})} placeholder="O que precisa ser feito?"></textarea>
        </section>

        {/* Items Table */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-theme">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Peças e Mão de Obra</h3>
            {!isReadOnly && <div className="flex gap-2"><button onClick={() => handleAddItem('Produto')} className="text-[10px] font-black uppercase text-primary bg-primary/5 dark:bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-all">+ Peça</button><button onClick={() => handleAddItem('Serviço')} className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 transition-all">+ Serviço</button></div>}
          </div>
          <table className="w-full text-left">
             <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <tr><th className="px-6 py-3">Tipo</th><th className="px-6 py-3">Descrição</th><th className="px-6 py-3 w-32 text-center">Qtd</th><th className="px-6 py-3 w-40 text-right">Total</th></tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-400 italic">Nenhum item adicionado à OS.</td>
                  </tr>
                ) : items.map(item => (
                  <tr key={item.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-3"><span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${item.type === 'Produto' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'}`}>{item.type[0]}</span></td>
                    <td className="px-6 py-3"><input type="text" className="w-full bg-transparent border-none outline-none dark:text-white placeholder-slate-400" value={item.description} onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)} placeholder="Descrição do item..." /></td>
                    <td className="px-6 py-3 text-center"><input type="number" className="w-16 text-center bg-transparent dark:text-white outline-none" value={item.quantity} onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)} /></td>
                    <td className="px-6 py-3 text-right font-black text-slate-800 dark:text-white">{item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  </tr>
                ))}
             </tbody>
          </table>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-8 mt-8 gap-6">
           <div className="flex gap-4 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs"><Save size={16}/> Salvar Rascunho</button>
           </div>
           <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              <div className="text-center sm:text-right">
                 <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total da OS</p>
                 <p className="text-3xl font-black text-primary">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button onClick={onBack} className="flex-1 sm:flex-none px-6 py-2.5 text-slate-400 font-bold hover:text-slate-600 dark:hover:text-slate-300 text-xs transition-colors">Cancelar</button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-3.5 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all text-xs uppercase tracking-widest hover:opacity-90">
                  <CheckCircle2 size={18} /> Finalizar OS
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OSForm;
