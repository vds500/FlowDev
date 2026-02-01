
import React, { useState, useEffect } from 'react';
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
  Info
} from 'lucide-react';
import { Quote, QuoteStatus, ServiceItem } from '../types';

interface QuoteFormProps {
  onBack: () => void;
  quoteToEdit?: Quote | null;
}

const MOCK_CLIENTS = [
  { id: '1', name: 'Supermercado Nova Era', document: '12.345.678/0001-90', contact: 'Sr. João', phone: '(11) 98888-7777', email: 'contato@novaera.com.br' },
  { id: '2', name: 'Ana Paula Mendonça', document: '123.456.789-00', contact: 'Ana', phone: '(11) 97777-6666', email: 'ana.paula@gmail.com' },
];

const MOCK_PRODUCTS: { id: string; type: 'Produto' | 'Serviço'; description: string; unitPrice: number }[] = [
  { id: 'p1', type: 'Produto', description: 'Termostato Digital K-50', unitPrice: 120.00 },
  { id: 'p2', type: 'Serviço', description: 'Limpeza de Condensadora', unitPrice: 250.00 },
  { id: 'p3', type: 'Produto', description: 'Gás Refrigerante R410a (kg)', unitPrice: 85.00 },
  { id: 'p4', type: 'Serviço', description: 'Mão de Obra Técnica', unitPrice: 150.00 },
];

const QuoteForm: React.FC<QuoteFormProps> = ({ onBack, quoteToEdit }) => {
  const isEditMode = !!quoteToEdit?.id;
  const isReadOnly = quoteToEdit?.status === QuoteStatus.Approved || quoteToEdit?.status === QuoteStatus.Cancelled;

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [address, setAddress] = useState({ cep: '', city: '', street: '', number: '', complement: '', neighborhood: '' });
  const [quoteInfo, setQuoteInfo] = useState({
    number: quoteToEdit?.number || '',
    date: quoteToEdit?.issueDate || new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    validityDays: '15',
    salesperson: quoteToEdit?.salesperson || 'Admin',
    paymentMethod: quoteToEdit?.paymentMethod || 'Pix',
    observations: ''
  });

  const [items, setItems] = useState<ServiceItem[]>(quoteToEdit?.items || []);
  const [globalDiscount, setGlobalDiscount] = useState(0);

  useEffect(() => {
    if (quoteToEdit) {
      setClientSearch(quoteToEdit.clientName);
      const client = MOCK_CLIENTS.find(c => c.name === quoteToEdit.clientName);
      if (client) setSelectedClient(client);
    }
  }, [quoteToEdit]);

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const total = subtotal - globalDiscount;

  const handleAddItem = () => {
    if (isReadOnly) return;
    const newItem: ServiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'Produto',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof ServiceItem, value: any) => {
    if (isReadOnly) return;
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        const qty = field === 'quantity' ? Number(value) : updated.quantity;
        const price = field === 'unitPrice' ? Number(value) : updated.unitPrice;
        const disc = field === 'discount' ? Number(value) : updated.discount;
        updated.total = qty * (price - disc);
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    if (isReadOnly) return;
    setItems(items.filter(item => item.id !== id));
  };

  const handleSelectProduct = (id: string, productId: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) {
      handleUpdateItem(id, 'description', product.description);
      handleUpdateItem(id, 'unitPrice', product.unitPrice);
      handleUpdateItem(id, 'type', product.type);
    }
  };

  const handleCepLookup = (cep: string) => {
    setAddress(prev => ({ ...prev, cep }));
    if (cep.length === 8) {
      setTimeout(() => {
        setAddress(prev => ({
          ...prev,
          city: 'São Paulo',
          street: 'Avenida Paulista',
          neighborhood: 'Bela Vista'
        }));
      }, 500);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:text-white transition-colors disabled:bg-slate-100 dark:disabled:bg-slate-900 placeholder-slate-400";

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {isEditMode ? `Editar Orçamento Nº ${quoteInfo.number}` : 'Novo Orçamento'}
            </h1>
            {isEditMode && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                quoteToEdit?.status === QuoteStatus.Approved ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800'
              }`}>
                Status: {quoteToEdit?.status}
              </span>
            )}
          </div>
        </div>
        
        {isReadOnly && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-3 rounded-lg flex items-center gap-3 text-amber-700 dark:text-amber-400 max-w-md">
            <Info size={18} className="shrink-0" />
            <p className="text-xs font-medium">
              Este orçamento já foi {quoteToEdit?.status?.toLowerCase()} e não pode ser editado.
            </p>
          </div>
        )}
      </div>

      <div className={`space-y-6 ${isReadOnly ? 'opacity-80' : ''}`}>
        {/* Section 1: Client Data */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-theme">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <User size={20} />
            <h2 className="font-bold uppercase tracking-wider text-sm">Dados do Cliente</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Buscar Cliente</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Nome, CPF ou CNPJ..." 
                  disabled={isReadOnly}
                  className={inputClass + " pl-10"}
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    const found = MOCK_CLIENTS.find(c => c.name.toLowerCase().includes(e.target.value.toLowerCase()));
                    if (found && e.target.value.length > 2) setSelectedClient(found);
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">CPF/CNPJ (Obrigatório)</label>
              <input 
                type="text" 
                value={selectedClient?.document || ''} 
                className={inputClass + " font-mono disabled:opacity-70"}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Responsável / Comprador</label>
              <input type="text" disabled={isReadOnly} className={inputClass} placeholder="Ex: Sr. João" defaultValue={selectedClient?.contact || ''} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Telefone (Principal / WhatsApp)</label>
              <input type="text" disabled={isReadOnly} className={inputClass} placeholder="(00) 00000-0000" defaultValue={selectedClient?.phone || ''} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Celular (Opcional)</label>
              <input type="text" disabled={isReadOnly} className={inputClass} placeholder="(00) 00000-0000" />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <MapPin size={16} />
              <h3 className="font-bold text-[10px] uppercase tracking-widest">Endereço de Execução</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">CEP</label>
                <input 
                  type="text" 
                  disabled={isReadOnly}
                  className={inputClass}
                  value={address.cep}
                  onChange={(e) => handleCepLookup(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Município / Cidade</label>
                <input type="text" className={inputClass + " bg-slate-100 dark:bg-slate-800 font-bold"} value={address.city} readOnly />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Logradouro</label>
                <input type="text" disabled={isReadOnly} className={inputClass} value={address.street} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Quote Info */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-theme">
          <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400">
            <Calendar size={20} />
            <h2 className="font-bold uppercase tracking-wider text-sm">Informações do Orçamento</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Data da Abertura</label>
              <input type="date" disabled={isReadOnly} value={quoteInfo.date} className={inputClass} onChange={(e) => setQuoteInfo({...quoteInfo, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Hora</label>
              <input type="text" value={quoteInfo.time} className={inputClass + " bg-slate-100 dark:bg-slate-800"} readOnly />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Validade (Dias)</label>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={quoteInfo.validityDays}
                onChange={(e) => setQuoteInfo({...quoteInfo, validityDays: e.target.value})}
              >
                <option value="7">7 Dias</option>
                <option value="15">15 Dias</option>
                <option value="30">30 Dias</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Vendedor</label>
              <select disabled={isReadOnly} className={inputClass} defaultValue={quoteInfo.salesperson}>
                <option>Admin</option>
                <option>Maria Souza</option>
                <option>Ricardo Souza</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 3: Items Table */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-theme">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
              <h2 className="font-bold uppercase tracking-wider text-sm">Itens do Orçamento</h2>
            </div>
            {!isReadOnly && (
              <button 
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-100 dark:border-emerald-800"
              >
                <Plus size={16} /> Adicionar Item
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-3 w-16 text-center">#</th>
                  <th className="px-6 py-3">Produto / Serviço</th>
                  <th className="px-6 py-3 w-32 text-center">Qtd.</th>
                  <th className="px-6 py-3 w-40 text-right">Total</th>
                  {!isReadOnly && <th className="px-6 py-3 w-20"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-center text-xs font-bold text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      {isReadOnly ? (
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.description}</span>
                      ) : (
                        <select 
                          className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-800 dark:text-slate-200"
                          value={MOCK_PRODUCTS.find(p => p.description === item.description)?.id || ''}
                          onChange={(e) => handleSelectProduct(item.id, e.target.value)}
                        >
                          <option value="" disabled>Selecione um produto...</option>
                          {MOCK_PRODUCTS.map(p => (
                            <option key={p.id} value={p.id}>{p.description}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        disabled={isReadOnly}
                        className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-sm text-center dark:text-white"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-white">
                      {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    {!isReadOnly && (
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleRemoveItem(item.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-xs ml-auto space-y-3">
              <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Total Geral</span>
                <span className="text-2xl font-black text-primary">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {!isReadOnly && (
              <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm shadow-sm">
                <Save size={18} /> Salvar Rascunho
              </button>
            )}
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm shadow-sm">
              <Printer size={18} /> Imprimir Orçamento
            </button>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={onBack}
              className="px-6 py-2.5 text-slate-400 dark:text-slate-500 font-bold hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm"
            >
              Voltar
            </button>
            {!isReadOnly && (
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white font-black rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 text-sm uppercase tracking-wider">
                <Send size={18} /> Gerar Proposta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;
