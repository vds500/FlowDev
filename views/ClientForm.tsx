
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Building2, 
  User, 
  Check, 
  AlertCircle, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Loader2,
  Activity,
  Globe,
  Info
} from 'lucide-react';
import { Client, ClientType, ClientStatus } from '../types';

interface ClientFormProps {
  onBack: () => void;
  clientToEdit?: Client | null;
}

const ClientForm: React.FC<ClientFormProps> = ({ onBack, clientToEdit }) => {
  const isEditMode = !!clientToEdit?.id;
  const [type, setType] = useState<ClientType>(clientToEdit?.type || ClientType.PJ);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Client>>({
    status: ClientStatus.Active,
    type: clientToEdit?.type || ClientType.PJ,
    name: clientToEdit?.name || '',
    fantasyName: clientToEdit?.fantasyName || '',
    document: clientToEdit?.document || '',
    phone: clientToEdit?.phone || '',
    whatsapp: clientToEdit?.whatsapp || '',
    email: clientToEdit?.email || '',
    cep: clientToEdit?.cep || '',
    city: clientToEdit?.city || '',
    uf: clientToEdit?.uf || '',
    street: clientToEdit?.street || '',
    number: clientToEdit?.number || '',
    neighborhood: clientToEdit?.neighborhood || '',
    notes: clientToEdit?.notes || ''
  });

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary dark:text-white transition-colors placeholder-slate-400";

  const handleLookupCNPJ = async () => {
    const cleanCNPJ = formData.document?.replace(/\D/g, '');
    if (!cleanCNPJ || cleanCNPJ.length !== 14) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const handleLookupCEP = async (cep: string) => {
    setFormData(prev => ({ ...prev, cep }));
    if (cep.length === 8) {
      setFormData(prev => ({ ...prev, city: 'Caldas Novas', uf: 'GO', street: 'Centro Comercial', neighborhood: 'Centro' }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
        </div>

        {!isEditMode && (
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 transition-theme">
            <button 
              type="button"
              onClick={() => setType(ClientType.PJ)} 
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${type === ClientType.PJ ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              PJ
            </button>
            <button 
              type="button"
              onClick={() => setType(ClientType.PF)} 
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${type === ClientType.PF ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              PF
            </button>
          </div>
        )}
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-theme">
          <div className="flex items-center gap-2 mb-8 text-primary border-b border-slate-50 dark:border-slate-800 pb-4 transition-theme">
            <Activity size={18} />
            <h2 className="font-black uppercase tracking-widest text-[11px]">Identificação</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">CPF / CNPJ</label>
              <div className="flex gap-2">
                <input type="text" className={inputClass + " font-mono"} value={formData.document} onChange={(e) => setFormData({...formData, document: e.target.value})} placeholder="00.000.000/0000-00" />
                {type === ClientType.PJ && (
                  <button 
                    type="button" 
                    onClick={handleLookupCNPJ} 
                    className="bg-primary text-white px-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18}/>}
                  </button>
                )}
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Nome / Razão Social</label>
              <input type="text" className={inputClass} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nome completo do cliente" />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-theme">
          <div className="flex items-center gap-2 mb-8 text-indigo-600 dark:text-indigo-400 border-b border-slate-50 dark:border-slate-800 pb-4 transition-theme">
            <Globe size={18} />
            <h2 className="font-black uppercase tracking-widest text-[11px]">Contato</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Telefone Principal</label>
              <div className="relative">
                <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" className={inputClass + " pl-10"} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="(00) 00000-0000" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">E-mail</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" className={inputClass + " pl-10"} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="exemplo@email.com" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-theme">
          <div className="flex items-center gap-2 mb-8 text-emerald-600 dark:text-emerald-400 border-b border-slate-50 dark:border-slate-800 pb-4 transition-theme">
            <MapPin size={18} />
            <h2 className="font-black uppercase tracking-widest text-[11px]">Endereço</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">CEP</label>
              <input type="text" className={inputClass} value={formData.cep} onChange={(e) => handleLookupCEP(e.target.value)} placeholder="00000-000" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Rua / Logradouro</label>
              <input type="text" className={inputClass} value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} placeholder="Rua, Avenida..." />
            </div>
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Nº</label>
              <input type="text" className={inputClass} value={formData.number} onChange={(e) => setFormData({...formData, number: e.target.value})} placeholder="S/N" />
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button type="button" onClick={onBack} className="w-full sm:w-auto px-6 py-3 text-slate-400 dark:text-slate-500 font-bold hover:text-slate-600 dark:hover:text-slate-300 transition-all text-sm">Cancelar</button>
          <button 
            type="submit" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-95 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Save size={18} /> {isEditMode ? 'Atualizar Cliente' : 'Finalizar Cadastro'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
