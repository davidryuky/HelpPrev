import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Lock, Search, CheckCircle, Clock, FileText, X, Save, RefreshCw, Loader2, Trash2, Filter, Briefcase, Eye, Smartphone, Globe, Fingerprint, Mail, Send, ChevronLeft, ChevronRight, BarChart3, TrendingUp, CalendarRange, PieChart, MapPin, Bell, Activity, Download } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  state?: string;
  type: string;
  status: 'pendente' | 'lido' | 'em_atendimento';
  notes: string;
  created_at: string;
  ip?: string;
  metadata?: string; // JSON string
}

// URL de som de notificação (MP3 hospedado publicamente)
const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visitCount, setVisitCount] = useState(0); // Novo estado para visitas
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewDataLead, setViewDataLead] = useState<Lead | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Notificações
  const [lastLeadId, setLastLeadId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{show: boolean, message: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  
  // Estados para envio de email
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
  
  // Estado para gráfico
  const [hoveredChartIndex, setHoveredChartIndex] = useState<number | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Inicializar Áudio
  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.volume = 0.5;
  }, []);

  // Verificar sessão ao carregar
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  // Polling para novos dados (a cada 30 segundos)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchData(true); // true = silent mode (background)
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, lastLeadId]);

  // Resetar paginação ao filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Erro no Servidor (${response.status}): Resposta inválida.`);
      }

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setErrorMsg(data.details ? `Erro BD: ${data.details}` : (data.error || 'Erro desconhecido.'));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro de conexão ou erro interno no servidor.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setLeads([]);
    setLastLeadId(null);
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Erro ao reproduzir som (interação necessária):", e));
    }
  };

  // Função unificada para buscar dados
  const fetchData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    
    // Busca Leads
    try {
      const res = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (res.ok) {
        const data: Lead[] = await res.json();
        
        if (data.length > 0) {
          const newestLead = data[0];
          if (isBackground && lastLeadId !== null && newestLead.id > lastLeadId) {
            playNotificationSound();
            setNotification({
              show: true,
              message: `Novo lead recebido: ${newestLead.name} (${newestLead.type})`
            });
            setTimeout(() => setNotification(null), 8000);
          }
          setLastLeadId(newestLead.id);
        }
        setLeads(data);
      } else if (res.status === 401) {
        handleLogout();
        return;
      }
    } catch (err) {
      console.error(err);
    }

    // Busca Visitas
    try {
      const resVisits = await fetch('/api/visits');
      if (resVisits.ok) {
        const dataVisits = await resVisits.json();
        setVisitCount(dataVisits.count);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const updateLead = async (id: number, updates: Partial<Lead>) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ id, ...updates })
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, ...updates } : l));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, ...updates });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja EXCLUIR este lead? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const res = await fetch(`/api/leads?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
      } else {
        alert('Erro ao excluir lead');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao excluir');
    }
  };

  // Funções de Modal
  const openLeadModal = (lead: Lead) => {
    setSelectedLead(lead);
    setTempNotes(lead.notes || '');
  };

  const openDataModal = (lead: Lead) => {
    setViewDataLead(lead);
  };

  const handleOpenEmailModal = (lead: Lead) => {
    const waLink = `https://wa.me/55${lead.whatsapp.replace(/\D/g,'')}`;
    const generatedBody = `Olá Dr(a),

Segue abaixo um novo caso captado pela plataforma MeuPrev para sua análise.

--- DADOS DO CLIENTE ---
Nome: ${lead.name}
Telefone/WhatsApp: ${lead.whatsapp}
Link Direto: ${waLink}
Estado: ${lead.state || 'Não informado'}
Tipo da Demanda: ${lead.type}

--- OBSERVAÇÕES / RESUMO ---
${lead.notes || 'Nenhuma observação cadastrada.'}

--- DADOS TÉCNICOS ---
Data de Cadastro: ${new Date(lead.created_at).toLocaleDateString('pt-BR')}

Atenciosamente,
Equipe MeuPrev`;

    setEmailData({
      to: '',
      subject: `Encaminhamento de Caso: ${lead.name} - ${lead.type}`,
      body: generatedBody
    });
    setEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!emailData.to) {
      alert('Por favor, preencha o email do destinatário.');
      return;
    }
    
    setEmailSending(true);
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(emailData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert('Email enviado com sucesso!');
        setEmailModalOpen(false);
      } else {
        alert(`Erro ao enviar: ${data.details || data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão ao tentar enviar email.');
    } finally {
      setEmailSending(false);
    }
  };

  const saveNotes = async () => {
    if (selectedLead) {
      await updateLead(selectedLead.id, { notes: tempNotes });
      const btn = document.getElementById('save-btn');
      if(btn) btn.innerText = 'Salvo!';
      setTimeout(() => {
        if(btn) btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Salvar Alterações';
      }, 2000);
    }
  };

  const cycleStatus = (currentStatus: string) => {
    if (currentStatus === 'pendente') return 'lido';
    if (currentStatus === 'lido') return 'em_atendimento';
    return 'pendente';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'lido': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'em_atendimento': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock size={12} className="mr-1"/>;
      case 'lido': return <CheckCircle size={12} className="mr-1"/>;
      case 'em_atendimento': return <Briefcase size={12} className="mr-1"/>;
      default: return null;
    }
  };

  // Lógica de Score
  const calculateScore = (metadataStr?: string) => {
    if (!metadataStr) return 0;
    try {
      const meta = JSON.parse(metadataStr);
      let score = 20; // Base

      const ua = meta.userAgent || '';
      
      // Dispositivo
      if (ua.includes('iPhone')) score += 50;
      else if (ua.includes('Macintosh')) score += 60;
      else if (ua.includes('iPad')) score += 40;
      else if (ua.includes('Android')) {
        if (ua.includes('Android 13') || ua.includes('Android 14') || ua.includes('Android 15')) score += 30;
        else score += 10;
      } else if (ua.includes('Windows')) score += 20;

      // Resolução
      if (meta.screen) {
         const [w, h] = meta.screen.split('x').map(Number);
         if (w * h > 2000000) score += 10; // > 1080p
      }

      // Memória
      if (meta.deviceMemory && meta.deviceMemory >= 8) score += 10;

      return Math.min(score, 100);
    } catch (e) {
      return 0;
    }
  };

  // --- LÓGICA DE DADOS E PAGINAÇÃO ---

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lead.whatsapp.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'todos' || 
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // --- LÓGICA DE EXPORTAÇÃO CSV ---
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      alert("Nenhum dado disponível para exportar com os filtros atuais.");
      return;
    }

    const headers = [
      "ID",
      "Nome",
      "WhatsApp",
      "Estado",
      "Tipo Demanda",
      "Status",
      "Data Criação",
      "Anotações",
      "IP"
    ];

    const rows = filteredLeads.map(lead => [
      lead.id,
      `"${lead.name}"`, 
      lead.whatsapp,
      lead.state || "N/A",
      lead.type,
      lead.status,
      new Date(lead.created_at).toLocaleString('pt-BR'),
      `"${(lead.notes || '').replace(/"/g, '""')}"`, 
      lead.ip || ""
    ]);

    const csvContent = [
      "\uFEFF" + headers.join(","), 
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leads_export_${statusFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- LÓGICA DO DASHBOARD ---
  
  const stats = useMemo(() => {
    const total = leads.length;
    
    // Datas
    const now = new Date();
    const today = now.toLocaleDateString('pt-BR');
    const todayCount = leads.filter(l => new Date(l.created_at).toLocaleDateString('pt-BR') === today).length;
    
    // Status
    const inService = leads.filter(l => l.status === 'em_atendimento' || l.status === 'lido').length;
    const conversionRate = total > 0 ? Math.round((inService / total) * 100) : 0;

    // Tipos
    const byType: {[key: string]: number} = {};
    leads.forEach(l => {
      byType[l.type] = (byType[l.type] || 0) + 1;
    });
    const topTypes = Object.entries(byType)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5); 

    // Estados
    const byState: {[key: string]: number} = {};
    leads.forEach(l => {
      if(l.state) byState[l.state] = (byState[l.state] || 0) + 1;
    });
    const topStates = Object.entries(byState)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5); 

    // Últimos 30 dias (Atualizado)
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const fullDateStr = d.toLocaleDateString('pt-BR'); 
      
      const count = leads.filter(l => new Date(l.created_at).toLocaleDateString('pt-BR') === fullDateStr).length;
      last30Days.push({ date: dateStr, count });
    }

    return { total, todayCount, conversionRate, topTypes, topStates, last30Days };
  }, [leads]);

  // --- PREPARAÇÃO DADOS GRÁFICO (SVG) ---
  const chartData = useMemo(() => {
    if (stats.last30Days.length === 0) return { points: '', data: [], max: 0, avg: 0 };
    
    const values = stats.last30Days.map(d => d.count);
    const maxVal = Math.max(...values, 5); // Minimum cap of 5 for scaling
    
    const dataPoints = stats.last30Days.map((d, i) => {
      // X = percentagem da largura (0 a 100)
      const x = (i / (stats.last30Days.length - 1)) * 100;
      
      // Y = percentagem da altura (invertido, 0 é topo).
      // Usamos 80% da altura para o gráfico ter margem (padding) de 10% em cima e em baixo.
      const y = 100 - ((d.count / maxVal) * 80) - 10;
      
      return { x, y, ...d };
    });
    
    const pointsStr = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
    
    return { 
      points: pointsStr, 
      data: dataPoints, 
      max: maxVal,
      avg: Math.round(maxVal / 2) // Midpoint para o grid
    };
  }, [stats.last30Days]);

  // --- VIEW: LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-amber-100 p-3 rounded-full">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">MeuPrev Admin</h2>
          <p className="text-center text-slate-500 mb-6 text-sm">Área restrita de gestão</p>
          
          {errorMsg && (
             <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100 break-words">
               {errorMsg}
             </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Identificação"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors flex justify-center items-center"
            >
              {loginLoading ? <Loader2 className="animate-spin w-5 h-5"/> : 'Entrar no Sistema'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW: DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-100 pb-20 relative">
      {/* Toast de Notificação */}
      {notification?.show && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-sm border border-slate-700">
            <div className="bg-green-500 p-2 rounded-full animate-pulse">
              <Bell size={20} fill="currentColor" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">Novo Lead!</h4>
              <p className="text-xs text-slate-300">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-2 rounded font-bold text-sm">MP</div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Gestão de Leads</h1>
          </div>
          <div className="flex items-center gap-4">
             {/* Indicador de Status do Sistema */}
             <div className="hidden md:flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Monitorando em Tempo Real
             </div>

            <button onClick={() => fetchData(false)} className="p-2 text-slate-500 hover:text-amber-500 transition-colors" title="Atualizar">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700">
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Toolbar de Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar por nome ou telefone..." 
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none w-full md:w-64 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full md:w-auto">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select 
                className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none appearance-none bg-white w-full md:w-48 text-sm cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="lido">Lido</option>
                <option value="em_atendimento">Em Atendimento</option>
              </select>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors w-full md:w-auto justify-center"
              title="Exportar leads exibidos atualmente"
            >
              <Download size={16} /> Exportar CSV
            </button>
          </div>
          
          <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
            {filteredLeads.length} leads encontrados
          </div>
        </div>

        {/* Tabela de Leads */}
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Score</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedLeads.map((lead) => {
                  const score = calculateScore(lead.metadata);
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => updateLead(lead.id, { status: cycleStatus(lead.status) as any })}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${getStatusColor(lead.status)}`}>
                          {getStatusIcon(lead.status)}
                          {lead.status.replace('_', ' ').toUpperCase()}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')} <br/>
                        <span className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                        <div className="text-sm text-slate-500">{lead.whatsapp}</div>
                        <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:underline mt-1 inline-flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                           WhatsApp
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {lead.state || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 hidden md:table-cell">
                        {lead.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 hidden lg:table-cell">
                        <div className="flex items-center gap-2" title={`Tech Score: ${score}/100`}>
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" 
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{score}</span>
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEmailModal(lead)}
                            className="text-slate-400 hover:text-purple-600 transition-colors bg-slate-100 hover:bg-purple-100 p-2 rounded-lg"
                            title="Encaminhar por Email"
                          >
                            <Mail size={18} />
                          </button>
                           <button 
                            onClick={() => openDataModal(lead)}
                            className="text-slate-400 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-100 p-2 rounded-lg"
                            title="Ver Dados Técnicos"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => openLeadModal(lead)}
                            className="text-slate-400 hover:text-amber-600 transition-colors bg-slate-100 hover:bg-amber-100 p-2 rounded-lg"
                            title="Ver Anotações"
                          >
                            <FileText size={18} />
                          </button>
                          <button 
                            onClick={() => deleteLead(lead.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-100 p-2 rounded-lg"
                            title="Excluir Lead"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedLeads.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      {leads.length > 0 ? 'Nenhum contato encontrado com os filtros atuais.' : 'Nenhum contato recebido ainda.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Paginação Controles */}
          {totalPages > 1 && (
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Página <span className="font-bold text-slate-900">{currentPage}</span> de <span className="font-bold">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- DASHBOARD ANALYTICS --- */}
        <div className="mb-8">
           <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart3 className="text-amber-500" /> Dashboard de Performance
           </h2>
           
           {/* Top Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                 <div>
                    <p className="text-sm text-slate-500 font-medium">Total de Leads</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</h3>
                 </div>
                 <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <TrendingUp size={24} />
                 </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                 <div>
                    <p className="text-sm text-slate-500 font-medium">Leads Hoje</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.todayCount}</h3>
                 </div>
                 <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                    <CalendarRange size={24} />
                 </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                 <div>
                    <p className="text-sm text-slate-500 font-medium">Taxa de Atendimento</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.conversionRate}%</h3>
                 </div>
                 <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <CheckCircle size={24} />
                 </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                 <div>
                    <p className="text-sm text-slate-500 font-medium">Visitas no Site</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{visitCount}</h3>
                 </div>
                 <div className="bg-cyan-100 p-3 rounded-full text-cyan-600">
                    <Globe size={24} />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Gráfico de Linha Minimalista - Últimos 30 dias */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Activity size={18} className="text-amber-500" /> Fluxo de Leads (30 Dias)
                    </h3>
                    <div className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">
                        Média Diária: {(stats.last30Days.reduce((acc, curr) => acc + curr.count, 0) / 30).toFixed(1)}
                    </div>
                 </div>
                 
                 <div 
                    className="relative h-64 w-full select-none pl-8" 
                    onMouseLeave={() => setHoveredChartIndex(null)}
                 >
                   {/* Y Axis Labels (Absolute positioning) */}
                   <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] text-slate-400 font-medium py-[10%] pr-2 border-r border-slate-100">
                      <span className="text-right">{chartData.max}</span>
                      <span className="text-right">{chartData.avg}</span>
                      <span className="text-right">0</span>
                   </div>

                   {/* The Chart Area */}
                   <div className="relative w-full h-full">
                       {/* SVG Layer for the Line (Stretches) */}
                       <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible z-0">
                         {/* Grid lines */}
                         <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2"/>
                         <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2,2"/>
                         <line x1="0" y1="90" x2="100" y2="90" stroke="#f1f5f9" strokeWidth="0.5" />
                         
                         {/* The Line */}
                         {chartData.points && (
                           <polyline
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="1.5"
                              points={chartData.points}
                              vectorEffect="non-scaling-stroke"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                              className="drop-shadow-sm"
                           />
                         )}
                       </svg>

                       {/* HTML Layer for Dots (Prevents Distortion of Circles) */}
                       {chartData.data.map((p, i) => (
                           <div 
                              key={i}
                              className="absolute z-10 group"
                              style={{ 
                                  left: `${p.x}%`, 
                                  top: `${p.y}%`,
                                  transform: 'translate(-50%, -50%)' 
                              }}
                              onMouseEnter={() => setHoveredChartIndex(i)}
                           >
                              {/* Invisible larger hit area */}
                              <div className="w-4 h-4 rounded-full bg-transparent cursor-pointer"></div>
                              
                              {/* Visible Dot */}
                              <div 
                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-500 bg-white transition-all duration-200 pointer-events-none ${hoveredChartIndex === i ? 'w-3 h-3 border-amber-600 shadow-md scale-125' : 'w-1.5 h-1.5'}`}
                              ></div>

                               {/* Tooltip (Only visible on hover) */}
                               {hoveredChartIndex === i && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none flex flex-col items-center animate-in fade-in zoom-in-95 duration-150">
                                        <span className="font-bold text-base">{p.count}</span>
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{p.date}</span>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-900"></div>
                                    </div>
                               )}
                           </div>
                       ))}
                   </div>
                 </div>
                 {chartData.data.length === 0 && (
                   <div className="h-full flex items-center justify-center text-slate-400 text-sm">Sem dados recentes</div>
                 )}
              </div>

              {/* Distribuição por Tipo e Estado */}
              <div className="space-y-6">
                 {/* Top Tipos */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <PieChart size={18} className="text-slate-400" /> Demandas Mais Procuradas
                    </h3>
                    <div className="space-y-4">
                       {stats.topTypes.map(([type, count], idx) => (
                          <div key={type}>
                             <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-700">{type}</span>
                                <span className="text-slate-500">{count} leads</span>
                             </div>
                             <div className="w-full bg-slate-100 rounded-full h-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full" 
                                  style={{ width: `${(count / stats.total) * 100}%` }}
                                ></div>
                             </div>
                          </div>
                       ))}
                       {stats.topTypes.length === 0 && <p className="text-xs text-slate-400">Sem dados suficientes.</p>}
                    </div>
                 </div>

                 {/* Top Estados */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <MapPin size={18} className="text-slate-400" /> Top Estados
                    </h3>
                    <div className="space-y-4">
                       {stats.topStates.map(([uf, count], idx) => (
                          <div key={uf}>
                             <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-700">{uf}</span>
                                <span className="text-slate-500">{count}</span>
                             </div>
                             <div className="w-full bg-slate-100 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${(count / stats.total) * 100}%` }}
                                ></div>
                             </div>
                          </div>
                       ))}
                        {stats.topStates.length === 0 && <p className="text-xs text-slate-400">Sem dados suficientes.</p>}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Modal de Envio de Email */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Mail size={20} />
                <h3 className="font-bold">Encaminhar Caso</h3>
              </div>
              <button onClick={() => setEmailModalOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Email do Advogado(a)</label>
                   <input 
                     type="email" 
                     placeholder="nome@advocacia.com.br"
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                     value={emailData.to}
                     onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                   />
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Assunto</label>
                   <input 
                     type="text" 
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-slate-50"
                     value={emailData.subject}
                     onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                   />
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Mensagem (Editável)</label>
                   <textarea 
                     className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm font-mono leading-relaxed"
                     value={emailData.body}
                     onChange={(e) => setEmailData({...emailData, body: e.target.value})}
                   ></textarea>
                   <p className="text-xs text-slate-400 mt-1">Dica: Você pode adicionar comentários pessoais antes de enviar.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
               <button 
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSendEmail}
                  disabled={emailSending}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {emailSending ? <Loader2 className="animate-spin w-4 h-4"/> : <Send size={16} />}
                  {emailSending ? 'Enviando...' : 'Enviar Agora'}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Anotações */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Detalhes do Cliente</h3>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Nome</p>
                  <p className="text-slate-900">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">WhatsApp</p>
                  <p className="text-slate-900">{selectedLead.whatsapp}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Estado</p>
                  <p className="text-slate-900">{selectedLead.state || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Interesse</p>
                  <p className="text-slate-900">{selectedLead.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Status Atual</p>
                  <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
                        {selectedLead.status.replace('_', ' ').toUpperCase()}
                      </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Anotações Internas</label>
                <textarea 
                  className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none text-sm"
                  placeholder="Escreva observações sobre o caso..."
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
              <button 
                  onClick={() => {
                    if(selectedLead) deleteLead(selectedLead.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 size={16} /> Excluir Lead
              </button>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Fechar
                </button>
                <button 
                  id="save-btn"
                  onClick={saveNotes}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <Save size={16} /> Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Dados Técnicos */}
      {viewDataLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-white">
                <Smartphone size={20} className="text-amber-500"/>
                <h3 className="font-bold">Dados Digitais do Usuário</h3>
              </div>
              <button onClick={() => setViewDataLead(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-0">
               <div className="grid grid-cols-1 md:grid-cols-2">
                 <div className="p-6 border-r border-slate-100">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Informações de Rede</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Globe className="text-blue-500 mt-1" size={18} />
                        <div>
                          <p className="text-xs text-slate-500">Endereço IP</p>
                          <p className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-sm inline-block">{viewDataLead.ip || 'Não registrado'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Fingerprint className="text-purple-500 mt-1" size={18} />
                        <div>
                          <p className="text-xs text-slate-500">Fingerprint ID</p>
                          <p className="font-mono text-slate-800 text-sm break-all">
                             {viewDataLead.metadata ? JSON.parse(viewDataLead.metadata).fingerprint : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Dispositivo e Navegador</h4>
                    {viewDataLead.metadata ? (() => {
                      const meta = JSON.parse(viewDataLead.metadata);
                      return (
                        <div className="space-y-3 text-sm">
                           <div>
                              <p className="text-xs text-slate-500">Navegador (User Agent)</p>
                              <div className="bg-white border border-slate-200 p-2 rounded text-xs text-slate-600 break-words h-20 overflow-y-auto custom-scrollbar">
                                {meta.userAgent}
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-slate-500">Resolução</p>
                                <p className="font-medium text-slate-800">{meta.screen}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Idioma</p>
                                <p className="font-medium text-slate-800">{meta.language}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Plataforma</p>
                                <p className="font-medium text-slate-800">{meta.platform}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Fuso Horário</p>
                                <p className="font-medium text-slate-800">{meta.timezone}</p>
                              </div>
                           </div>
                        </div>
                      );
                    })() : (
                      <p className="text-slate-400 italic">Sem metadados disponíveis.</p>
                    )}
                 </div>
               </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setViewDataLead(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};