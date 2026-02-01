
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  MoreHorizontal, 
  Edit3, 
  Eye, 
  UserMinus, 
  ChevronDown,
  Download
} from 'lucide-react';
import { Client, ClientType, ClientStatus } from '../types';
import ClientForm from './ClientForm';

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    type: ClientType.PJ,
    status: ClientStatus.Active,
    name: 'Empresa XYZ Ltda',
    fantasyName: 'XYZ Tech',
    document: '12.345.678/0001-99',
    contactPerson: 'Ricardo Oliveira',
    phone: '(64) 99999-9999',
    whatsapp: '64999999999',
    email: 'contato@xyz.com.br',
    cep: '75690-000',
    city: 'Caldas Novas',
    uf: 'GO',
    street: 'Av. Orcalino Santos',
    number: '123',
    neighborhood: 'Centro',
    lastContact: '2025-02-01'
  },
  {
    id: '2',
    type: ClientType.PF,
    status: ClientStatus.Active,
    name: 'João Silva Oliveira',
    document: '123.456.789-00',
    phone: '(11) 98888-7777',
    email: 'joao.silva@gmail.com',
    cep: '01310-100',
    city: 'São Paulo',
    uf: 'SP',
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    lastContact: '2025-01-25'
  }
];

const ClientsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Ativo');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setSelectedClient(null);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return <ClientForm onBack={() => setIsFormOpen(false)} clientToEdit={selectedClient} />;
  }

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all text-sm placeholder-slate-400";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Clientes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie seu banco de dados de clientes e parceiros.</p>
        </div>
        <button 
          onClick={handleNew}
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:opacity-95 transition-all shadow-md shadow-primary/20"
        >
          <Plus size={18} />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-theme">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, documento, contato..." 
              className={inputClass}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">Tipo</label>
            <div className="relative">
              <select 
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none dark:text-white focus:ring-2 focus:ring-primary transition-theme"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option>Todos</option>
                <option>Pessoa Física</option>
                <option>Pessoa Jurídica</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">Status</label>
            <div className="relative">
              <select 
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm outline-none dark:text-white focus:ring-2 focus:ring-primary transition-theme"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>Ativo</option>
                <option>Inativo</option>
                <option>Todos</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-theme">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-theme">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest"># Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nome / Razão Social</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">CPF / CNPJ</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Contato</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_CLIENTS.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border ${
                      client.type === ClientType.PJ 
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800' 
                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800'
                    }`}>
                      {client.type === ClientType.PJ ? <Building2 size={12}/> : <User size={12}/>}
                      {client.type === ClientType.PJ ? 'PJ' : 'PF'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{client.name}</span>
                      {client.fantasyName && <span className="text-[10px] text-slate-400 dark:text-slate-500">{client.fantasyName}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 tracking-tighter">{client.document}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <Phone size={10} className="text-slate-400 dark:text-slate-500"/>
                        {client.phone}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[150px]">{client.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button 
                        onClick={() => handleEdit(client)}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                      >
                        <Edit3 size={16}/>
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                        <Eye size={16}/>
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <UserMinus size={16}/>
                      </button>
                    </div>
                    <div className="group-hover:hidden text-slate-300 dark:text-slate-700">
                      <MoreHorizontal size={16} className="ml-auto" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest transition-theme">
          <span>Mostrando 1-2 de 428 clientes</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-30" disabled>Anterior</button>
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsList;
