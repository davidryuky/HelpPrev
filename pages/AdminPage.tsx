import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Bell, X, Settings } from 'lucide-react';
import { Login } from '../components/admin/Login';
import { Dashboard } from '../components/admin/Dashboard';
import { LeadsTable } from '../components/admin/LeadsTable';
import { SettingsModal, EmailModal, TechModal, LeadDetailsModal } from '../components/admin/Modals';
import { Lead } from '../types';

const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visitCount, setVisitCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [headScripts, setHeadScripts] = useState('');

  const [lastLeadId, setLastLeadId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{show: boolean, message: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.volume = 0.5;
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, lastLeadId]);

  const handleLogin = async (username: string, password: string) => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError(data.details || data.error || 'Erro desconhecido.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Erro de conexão.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setLeads([]);
  };

  const fetchData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await fetch('/api/leads', { headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` } });
      if (res.ok) {
        const data: Lead[] = await res.json();
        if (data.length > 0) {
          const newest = data[0];
          if (isBackground && lastLeadId !== null && newest.id > lastLeadId) {
            audioRef.current?.play().catch(console.error);
            setNotification({ show: true, message: `Novo lead: ${newest.name} (${newest.type})` });
            setTimeout(() => setNotification(null), 8000);
          }
          setLastLeadId(newest.id);
        }
        setLeads(data);
      } else if (res.status === 401) handleLogout();
      
      const resVisits = await fetch('/api/visits');
      if (resVisits.ok) {
        const dataVisits = await resVisits.json();
        setVisitCount(dataVisits.count);
      }
    } catch (err) { console.error(err); } 
    finally { if (!isBackground) setLoading(false); }
  };

  const updateLead = async (id: number, updates: Partial<Lead>) => {
    try {
      await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: JSON.stringify({ id, ...updates })
      });
      setLeads(leads.map(l => l.id === id ? { ...l, ...updates } : l));
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, ...updates });
    } catch (err) { console.error(err); }
  };

  const deleteLead = async (id: number) => {
    if (!window.confirm('Excluir este lead?')) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` } });
      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id));
        if (selectedLead?.id === id) { setSelectedLead(null); setDetailsOpen(false); }
      }
    } catch (err) { console.error(err); }
  };

  const handleOpenSettings = async () => {
    setSettingsOpen(true);
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setHeadScripts(data.head_scripts || '');
      }
    } catch (e) { console.error(e); }
  };

  const saveSettings = async (scripts: string) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: JSON.stringify({ head_scripts: scripts })
      });
      if (res.ok) { alert('Configurações salvas!'); setSettingsOpen(false); }
    } catch (e) { alert('Erro ao salvar.'); }
  };

  const handleSendEmail = async (data: any) => {
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: JSON.stringify(data)
      });
      if (res.ok) { alert('Email enviado!'); setEmailOpen(false); }
      else { const d = await res.json(); alert(`Erro: ${d.details}`); }
    } catch (e) { alert('Erro de conexão.'); }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} loading={loginLoading} error={loginError} />;

  return (
    <div className="min-h-screen bg-slate-100 pb-20 relative">
      {notification?.show && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-sm border border-slate-700">
            <div className="bg-green-500 p-2 rounded-full animate-pulse"><Bell size={20} fill="currentColor" /></div>
            <div className="flex-1"><h4 className="font-bold text-sm">Novo Lead!</h4><p className="text-xs text-slate-300">{notification.message}</p></div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2"><div className="bg-slate-900 text-white p-2 rounded font-bold text-sm">MP</div><h1 className="text-xl font-bold text-slate-800 hidden sm:block">Gestão de Leads</h1></div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
               <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
               Monitorando
             </div>
            <button onClick={() => fetchData(false)} className="p-2 text-slate-500 hover:text-amber-500 transition-colors"><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>
            <div className="h-8 w-px bg-slate-200"></div>
            <button onClick={handleOpenSettings} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2"><Settings size={18} /><span className="hidden sm:inline">Config</span></button>
            <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700">Sair</button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Dashboard leads={leads} visitCount={visitCount} />
        <LeadsTable 
          leads={leads} 
          loading={loading}
          onUpdateStatus={(id, status) => updateLead(id, { status: status as any })}
          onDelete={deleteLead}
          onOpenEmail={(l) => { setSelectedLead(l); setEmailOpen(true); }}
          onOpenTech={(l) => { setSelectedLead(l); setTechOpen(true); }}
          onOpenDetails={(l) => { setSelectedLead(l); setDetailsOpen(true); }}
        />
      </main>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} onSave={saveSettings} initialScripts={headScripts} />
      <EmailModal isOpen={emailOpen} onClose={() => setEmailOpen(false)} lead={selectedLead} onSend={handleSendEmail} />
      <TechModal lead={selectedLead && techOpen ? selectedLead : null} onClose={() => setTechOpen(false)} />
      <LeadDetailsModal 
        lead={selectedLead && detailsOpen ? selectedLead : null} 
        onClose={() => setDetailsOpen(false)} 
        onSave={async (notes) => { if(selectedLead) await updateLead(selectedLead.id, { notes }); }}
        onDelete={deleteLead}
      />
    </div>
  );
};
