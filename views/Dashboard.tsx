
import React from 'react';
import { 
  FileText, 
  Wrench, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const dataOS = [
  { name: 'Seg', total: 12 },
  { name: 'Ter', total: 19 },
  { name: 'Qua', total: 15 },
  { name: 'Qui', total: 22 },
  { name: 'Sex', total: 30 },
  { name: 'Sáb', total: 10 },
];

const dataStatus = [
  { name: 'Concluídas', value: 40, color: '#10b981' },
  { name: 'Em Aberto', value: 30, color: '#3b82f6' },
  { name: 'Atrasadas', value: 15, color: '#ef4444' },
  { name: 'Aguardando Peça', value: 15, color: '#f59e0b' },
];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Olá, Bem-vindo ao FlowDev!</h1>
          <p className="text-slate-500 dark:text-slate-400">Aqui está o que está acontecendo hoje.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 shadow-sm">
            Jan 1 - Jan 31, 2025
          </div>
          <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors shadow-sm">
            Baixar Relatório
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Orçamentos Abertos" 
          value="R$ 45.230" 
          icon={FileText} 
          color="bg-blue-500"
          trend={12}
        />
        <StatCard 
          title="OS em Andamento" 
          value="24" 
          icon={Wrench} 
          color="bg-indigo-500"
          trend={5}
        />
        <StatCard 
          title="Preventivas este Mês" 
          value="12" 
          icon={Calendar} 
          color="bg-emerald-500"
          trend={-2}
        />
        <StatCard 
          title="Manutenções Vencidas" 
          value="08" 
          icon={AlertTriangle} 
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Volume de Ordens de Serviço (Semanal)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataOS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc20'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#0f172a', color: '#fff'}}
                  />
                  <Bar dataKey="total" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white">Próximos Agendamentos</h3>
              <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">Ver todos</button>
            </div>
            <div className="space-y-4">
              {[
                { time: '09:00', client: 'Condomínio Solar', service: 'Preventiva Ar Cond.', type: 'Preventive' },
                { time: '11:30', client: 'Padaria Central', service: 'Reparo Forno Industrial', type: 'OS' },
                { time: '14:00', client: 'João Silva', service: 'Instalação Elétrica', type: 'OS' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-xs font-bold text-slate-600 dark:text-slate-400">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.client}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.service}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    item.type === 'Preventive' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  }`}>
                    {item.type === 'Preventive' ? 'Preventiva' : 'Corretiva'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Dashboard Content */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Distribuição de Status</h3>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {dataStatus.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[var(--primary-color)] to-indigo-700 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-amber-300" />
              <h4 className="font-semibold">Alerta de Manutenção</h4>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Existem 8 manutenções preventivas que vencem nos próximos 7 dias. Clique para agendar.
            </p>
            <button className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-colors">
              Agendar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
