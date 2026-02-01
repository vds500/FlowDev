
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Calendar as CalendarIcon,
  Filter,
  AlertCircle,
  Plus,
  Clock,
  Wrench,
  CheckCircle2,
  Users,
  X,
  MapPin,
  ExternalLink,
  RotateCcw,
  Download,
  MoreVertical,
  ShieldCheck,
  AlertTriangle,
  Info,
  Activity
} from 'lucide-react';
import { OSStatus, Priority, CalendarEvent, OS } from '../types';
import OSForm from './OSForm';

const DAYS_HEADER = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

interface Holiday {
  date: string;
  name: string;
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  
  // States for OSForm integration
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [osToEdit, setOsToEdit] = useState<OS | null>(null);

  // Mock Data for Events
  const [events] = useState<CalendarEvent[]>([
    { id: '1', title: 'OS #000456 - João Silva Ltda', start: '2025-02-10T09:00:00', end: '2025-02-10T11:00:00', type: 'OS', status: OSStatus.InProgress, priority: Priority.High, relatedId: 'os-1' },
    { id: '2', title: 'Prev. Cond. Solar', start: '2025-02-10T14:30:00', end: '2025-02-10T15:30:00', type: 'Preventive', status: 'PreventivePending', priority: Priority.Medium, relatedId: 'prev-1' },
    { id: '3', title: 'OS #000458 - Clínica Life', start: '2025-02-12T08:15:00', end: '2025-02-12T10:00:00', type: 'OS', status: OSStatus.Open, priority: Priority.Urgent, relatedId: 'os-3' },
    { id: '4', title: 'Manut. Recorrente - Padaria Central', start: '2025-02-24T11:00:00', end: '2025-02-24T13:00:00', type: 'Preventive', status: 'PreventivePending', priority: Priority.Low, relatedId: 'os-4' },
    { id: '5', title: 'OS #000460 - Supermercado ABC', start: '2025-02-24T15:00:00', end: '2025-02-24T17:00:00', type: 'OS', status: OSStatus.Scheduled, priority: Priority.Medium, relatedId: 'os-5' },
  ]);

  // Simulate Holiday Integration
  useEffect(() => {
    const mockHolidays: Holiday[] = [
      { date: '2025-01-01', name: 'Confraternização Universal' },
      { date: '2025-02-24', name: 'Dia de Exemplo (Mock)' },
      { date: '2025-03-04', name: 'Carnaval' },
      { date: '2025-04-18', name: 'Sexta-feira Santa' },
      { date: '2025-05-01', name: 'Dia do Trabalho' },
    ];
    setHolidays(mockHolidays);
  }, []);

  // Calendar Logic
  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.start.startsWith(dateStr));
      const dayHoliday = holidays.find(h => h.date === dateStr);
      days.push({ day: i, date: dateStr, events: dayEvents, holiday: dayHoliday });
    }
    return days;
  }, [currentDate, events, holidays]);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleNewAgendamento = (date?: string) => {
    setOsToEdit(null);
    setIsFormOpen(true);
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.priority === Priority.Urgent) return 'bg-red-500 text-white border-red-600';
    if (event.type === 'Preventive') return 'bg-emerald-500 text-white border-emerald-600';
    
    switch (event.status) {
      case OSStatus.InProgress: return 'bg-blue-500 text-white border-blue-600';
      case OSStatus.Completed: return 'bg-slate-400 text-white border-slate-500';
      case OSStatus.Open: return 'bg-amber-500 text-white border-amber-600';
      default: return 'bg-indigo-500 text-white border-indigo-600';
    }
  };

  if (isFormOpen) {
    return <OSForm onBack={() => setIsFormOpen(false)} osToEdit={osToEdit} />;
  }

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Sidebar Filters & Info */}
      <aside className={`flex flex-col gap-6 transition-all duration-300 ${isFilterOpen ? 'w-72' : 'w-0 opacity-0 overflow-hidden'}`}>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Filtros da Agenda</h3>
            <RotateCcw size={14} className="text-slate-300 dark:text-slate-600 cursor-pointer hover:text-[var(--primary-color)] transition-colors" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                <Users size={14} className="text-[var(--primary-color)]"/> Técnicos
              </label>
              <div className="space-y-2">
                {['Pedro Ramos', 'Davi Mendes', 'Carlos Alberto', 'Juliana Lima'].map(tech => (
                  <label key={tech} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[var(--primary-color)] focus:ring-[var(--primary-color)] bg-transparent" />
                    <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{tech}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                <Activity size={14} className="text-amber-500"/> Status OS
              </label>
              <div className="space-y-2">
                {Object.values(OSStatus).map(status => (
                  <label key={status} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[var(--primary-color)] focus:ring-[var(--primary-color)] bg-transparent" />
                    <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
             <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-3">
                   <AlertCircle size={16} className="text-amber-400" />
                   <h4 className="text-xs font-bold uppercase tracking-wider">Disponibilidade</h4>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="opacity-60">Hoje:</span>
                      <span className="font-bold">3/5 Livres</span>
                   </div>
                   <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[var(--primary-color)] h-full w-[60%]"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-5 rounded-2xl">
           <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400">
              <ShieldCheck size={18} />
              <h4 className="text-xs font-black uppercase tracking-widest">Preventivas</h4>
           </div>
           <p className="text-[11px] text-blue-600 dark:text-blue-400/80 leading-relaxed font-medium mb-3">
              8 manutenções sugeridas para os próximos 7 dias.
           </p>
           <button className="w-full bg-[var(--primary-color)] text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
              Agendar em Lote
           </button>
        </div>
      </aside>

      {/* Main Calendar Content */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-lg border transition-all ${isFilterOpen ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-[var(--primary-color)]' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <Filter size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Agenda de Serviços</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Visualize e planeje a alocação técnica.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden lg:flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
                <button onClick={() => setViewMode('month')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'month' ? 'bg-[var(--primary-color)] text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Mês</button>
                <button onClick={() => setViewMode('week')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'week' ? 'bg-[var(--primary-color)] text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Semana</button>
                <button onClick={() => setViewMode('day')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'day' ? 'bg-[var(--primary-color)] text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Dia</button>
             </div>
             <button 
                onClick={() => handleNewAgendamento()}
                className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
             >
              <Plus size={16} /> Novo Agendamento
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
          {/* Calendar Header Nav */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 transition-colors shadow-sm"><ChevronLeft size={18} /></button>
                <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 transition-colors shadow-sm"><ChevronRight size={18} /></button>
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white capitalize min-w-[180px] text-center">
                {MONTHS[currentDate.getMonth()]} <span className="text-[var(--primary-color)]">{currentDate.getFullYear()}</span>
              </h2>
              <button onClick={goToToday} className="px-4 py-1.5 text-xs font-black text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all shadow-sm uppercase tracking-widest">Hoje</button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span>Corretiva</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span>Preventiva</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><span>Urgente</span></div>
              </div>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
              <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><Download size={18} /></button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 grid grid-cols-7 border-collapse bg-slate-50/10 dark:bg-slate-950/20">
            {DAYS_HEADER.map(day => (
              <div key={day} className="py-3 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 border-b border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 uppercase tracking-widest">
                {day}
              </div>
            ))}

            {monthData.map((dayObj, idx) => (
              <div 
                key={idx} 
                className={`min-h-[130px] p-2 border-b border-r border-slate-100 dark:border-slate-800 transition-all flex flex-col gap-1.5 ${
                  !dayObj.day ? 'bg-slate-50/20 dark:bg-slate-900/20' : 'bg-white dark:bg-slate-900/40'
                } ${dayObj.date === new Date().toISOString().split('T')[0] ? 'bg-blue-50/40 dark:bg-blue-900/10 ring-1 ring-inset ring-[var(--primary-color)]' : ''} group`}
              >
                {dayObj.day && (
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-black p-1.5 rounded-lg flex items-center justify-center min-w-[28px] ${
                      dayObj.date === new Date().toISOString().split('T')[0] ? 'bg-[var(--primary-color)] text-white shadow-md' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {dayObj.day}
                    </span>
                    {dayObj.holiday && (
                      <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 p-1 rounded-md" title={dayObj.holiday.name}>
                        <CalendarIcon size={12} />
                      </span>
                    )}
                  </div>
                )}

                <div className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide">
                  {dayObj.events?.map((event) => (
                    <div 
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`px-2 py-1.5 rounded-lg text-[9px] font-black border truncate shadow-sm cursor-pointer hover:scale-[1.02] transition-transform flex items-center gap-1.5 ${getEventColor(event)}`}
                    >
                      {event.priority === Priority.Urgent ? <AlertTriangle size={10} /> : event.type === 'Preventive' ? <ShieldCheck size={10} /> : <Wrench size={10} />}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {dayObj.day && !dayObj.holiday && (
                    <button 
                      onClick={() => handleNewAgendamento(dayObj.date)}
                      className="w-full py-1.5 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-slate-800 hover:border-[var(--primary-color)] transition-all flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-[var(--primary-color)]"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border dark:border-slate-800">
            <div className={`p-6 flex justify-between items-start ${selectedEvent.priority === Priority.Urgent ? 'bg-red-500' : 'bg-[var(--primary-color)]'} text-white`}>
              <div>
                <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                  {selectedEvent.type === 'OS' ? 'Ordem de Serviço' : 'Preventiva Recorrente'}
                </span>
                <h3 className="text-xl font-black">{selectedEvent.title}</h3>
                <p className="opacity-80 text-sm mt-1 flex items-center gap-1.5 font-medium">
                  <Clock size={14} /> {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Final Previsto: 12:00
                </p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Técnico Responsável</h4>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center text-[var(--primary-color)] font-black text-xs">PR</div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Pedro Ramos</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Prioridade</h4>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    selectedEvent.priority === Priority.Urgent ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  }`}>
                    {selectedEvent.priority}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Local da Execução</h4>
                <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <MapPin size={18} className="text-[var(--primary-color)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Av. Orcalino Santos, 123 - Centro</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Caldas Novas / GO</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
                >
                  <ExternalLink size={16} /> Abrir OS Detalhada
                </button>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Reagendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
