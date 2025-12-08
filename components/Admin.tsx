import React, { useState, useEffect } from 'react';
import { Lock, Search, CheckCircle, Clock, FileText, X, Save, RefreshCw } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  type: string;
  status: 'pendente' | 'lido' | 'em_atendimento';
  notes: string;
  created_at: string;
}

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Verificar sessão ao carregar
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token === 'MAY-MAY@@umi') {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'MAY' && password === 'MAY@@umi') {
      localStorage.setItem('admin_token', 'MAY-MAY@@umi');
      setIsAuthenticated(true);
      fetchLeads();
    } else {
      alert('Credenciais inválidas');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const openLeadModal = (lead: Lead) => {
    setSelectedLead(lead);
    setTempNotes(lead.notes || '');
  };

  const saveNotes = async () => {
    if (selectedLead) {
      await updateLead(selectedLead.id, { notes: tempNotes });
      alert('Anotações salvas!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-amber-100 p-3 rounded-full">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Acesso Administrativo</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-2 rounded font-bold text-sm">HP</div>
            <h1 className="text-xl font-bold text-slate-800">Painel de Leads</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchLeads} className="p-2 text-slate-500 hover:text-amber-500 transition-colors" title="Atualizar">
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
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        onClick={() => updateLead(lead.id, { status: lead.status === 'pendente' ? 'lido' : 'pendente' })}
                        className={`cursor-pointer inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.status === 'pendente' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {lead.status === 'pendente' ? <Clock size={12} className="mr-1"/> : <CheckCircle size={12} className="mr-1"/>}
                        {lead.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')} <br/>
                      <span className="text-xs">{new Date(lead.created_at).toLocaleTimeString('pt-BR')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                      <div className="text-sm text-slate-500">{lead.whatsapp}</div>
                      <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:underline mt-1 inline-block">
                        Abrir WhatsApp
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {lead.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openLeadModal(lead)}
                        className="text-slate-400 hover:text-amber-600 transition-colors"
                      >
                        <FileText size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Nenhum contato recebido ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

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
                  <p className="text-xs text-slate-500 uppercase font-bold">Interesse</p>
                  <p className="text-slate-900">{selectedLead.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Status Atual</p>
                  <p className={`${selectedLead.status === 'pendente' ? 'text-amber-600' : 'text-green-600'} font-semibold`}>
                    {selectedLead.status.toUpperCase()}
                  </p>
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

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
               <button 
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                Fechar
              </button>
              <button 
                onClick={saveNotes}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Save size={16} /> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};