import React, { useState } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Clock, CheckCircle, Briefcase, Mail, Eye, FileText, Trash2 } from 'lucide-react';
import { Lead } from '../../types';

interface LeadsTableProps {
  leads: Lead[];
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
  onOpenEmail: (lead: Lead) => void;
  onOpenTech: (lead: Lead) => void;
  onOpenDetails: (lead: Lead) => void;
  loading: boolean;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ 
  leads, onUpdateStatus, onDelete, onOpenEmail, onOpenTech, onOpenDetails, loading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

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

  const calculateScore = (metadataStr?: string) => {
    if (!metadataStr) return 0;
    try {
      const meta = JSON.parse(metadataStr);
      let score = 20;
      const ua = meta.userAgent || '';
      if (ua.includes('iPhone')) score += 50;
      else if (ua.includes('Macintosh')) score += 60;
      else if (ua.includes('iPad')) score += 40;
      else if (ua.includes('Android')) score += (ua.includes('Android 13') || ua.includes('Android 14')) ? 30 : 10;
      else if (ua.includes('Windows')) score += 20;
      if (meta.screen) { const [w, h] = meta.screen.split('x').map(Number); if (w * h > 2000000) score += 10; }
      if (meta.deviceMemory && meta.deviceMemory >= 8) score += 10;
      return Math.min(score, 100);
    } catch (e) { return 0; }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.whatsapp.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) { alert("Sem dados para exportar."); return; }
    const headers = ["ID", "Nome", "WhatsApp", "Estado", "Tipo", "Status", "Data", "Anotações"];
    const rows = filteredLeads.map(l => [
      l.id, `"${l.name}"`, l.whatsapp, l.state || "N/A", l.type, l.status,
      new Date(l.created_at).toLocaleString('pt-BR'), `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = ["\uFEFF" + headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }));
    link.setAttribute("download", `leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" placeholder="Buscar por nome ou telefone..." 
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none w-full md:w-64 text-sm"
              value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="relative w-full md:w-auto">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select 
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none appearance-none bg-white w-full md:w-48 text-sm cursor-pointer"
              value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="lido">Lido</option>
              <option value="em_atendimento">Em Atendimento</option>
            </select>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors w-full md:w-auto justify-center">
            <Download size={16} /> Exportar CSV
          </button>
        </div>
        <div className="text-sm text-slate-500 font-medium whitespace-nowrap">{filteredLeads.length} leads encontrados</div>
      </div>

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
                        onClick={() => onUpdateStatus(lead.id, cycleStatus(lead.status))}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${getStatusColor(lead.status)}`}>
                        {getStatusIcon(lead.status)} {lead.status.replace('_', ' ').toUpperCase()}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')} <br/>
                      <span className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                      <div className="text-sm text-slate-500">{lead.whatsapp}</div>
                      <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:underline mt-1 inline-flex items-center gap-1">WhatsApp</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{lead.state || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 hidden md:table-cell">{lead.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 hidden lg:table-cell">
                      <div className="flex items-center gap-2" title={`Tech Score: ${score}/100`}>
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" style={{ width: `${score}%` }}></div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{score}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onOpenEmail(lead)} className="text-slate-400 hover:text-purple-600 bg-slate-100 hover:bg-purple-100 p-2 rounded-lg" title="Email"><Mail size={18} /></button>
                        <button onClick={() => onOpenTech(lead)} className="text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-100 p-2 rounded-lg" title="Dados Técnicos"><Eye size={18} /></button>
                        <button onClick={() => onOpenDetails(lead)} className="text-slate-400 hover:text-amber-600 bg-slate-100 hover:bg-amber-100 p-2 rounded-lg" title="Anotações"><FileText size={18} /></button>
                        <button onClick={() => onDelete(lead.id)} className="text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-100 p-2 rounded-lg" title="Excluir"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedLeads.length === 0 && !loading && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">Nenhum contato encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">Página <span className="font-bold text-slate-900">{currentPage}</span> de <span className="font-bold">{totalPages}</span></span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
