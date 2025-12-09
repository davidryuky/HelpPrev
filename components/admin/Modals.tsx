import React, { useState, useEffect } from 'react';
import { X, Settings, Code, Save, Loader2, Mail, Send, Trash2, Smartphone, Globe, Fingerprint } from 'lucide-react';
import { Lead } from '../Admin';

// --- SETTINGS MODAL ---
export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (scripts: string) => Promise<void>; initialScripts: string }> = ({ isOpen, onClose, onSave, initialScripts }) => {
  const [scripts, setScripts] = useState(initialScripts);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setScripts(initialScripts); }, [initialScripts]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave(scripts);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2"><Settings size={20} className="text-amber-500" /><h3 className="font-bold">Configurações Globais</h3></div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
               <Code className="text-amber-600 mt-1 flex-shrink-0" size={18} />
               <div><h4 className="font-bold text-amber-900 text-sm">Scripts do Cabeçalho (Head)</h4><p className="text-xs text-amber-800 mt-1">Insira tags Google, Pixel, etc. (HTML/JS válido).</p></div>
            </div>
            <textarea className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none text-xs font-mono bg-slate-50 text-slate-700" value={scripts} onChange={(e) => setScripts(e.target.value)} placeholder="<!-- Exemplo -->"></textarea>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-70">{saving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save size={16} />} Salvar</button>
        </div>
      </div>
    </div>
  );
};

// --- EMAIL MODAL ---
export const EmailModal: React.FC<{ isOpen: boolean; onClose: () => void; lead: Lead | null; onSend: (data: any) => Promise<void> }> = ({ isOpen, onClose, lead, onSend }) => {
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      setEmailData({
        to: '',
        subject: `Encaminhamento de Caso: ${lead.name} - ${lead.type}`,
        body: `Olá Dr(a),\n\nSegue abaixo um novo caso captado pela plataforma MeuPrev.\n\n--- DADOS DO CLIENTE ---\nNome: ${lead.name}\nWhatsApp: ${lead.whatsapp}\nEstado: ${lead.state || 'N/A'}\nTipo: ${lead.type}\n\n--- NOTAS ---\n${lead.notes || 'Sem observações.'}\n\nAtenciosamente,\nEquipe MeuPrev`
      });
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const handleSend = async () => {
    setSending(true);
    await onSend(emailData);
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2"><Mail size={20} /><h3 className="font-bold">Encaminhar Caso</h3></div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Para:</label><input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500" value={emailData.to} onChange={(e) => setEmailData({...emailData, to: e.target.value})} placeholder="email@advogado.com" /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Assunto:</label><input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 bg-slate-50" value={emailData.subject} onChange={(e) => setEmailData({...emailData, subject: e.target.value})} /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-1">Mensagem:</label><textarea className="w-full h-48 px-4 py-3 border rounded-lg focus:ring-purple-500 text-sm font-mono" value={emailData.body} onChange={(e) => setEmailData({...emailData, body: e.target.value})}></textarea></div>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium">Cancelar</button>
           <button onClick={handleSend} disabled={sending} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold flex items-center gap-2">{sending ? <Loader2 className="animate-spin w-4 h-4"/> : <Send size={16} />} Enviar</button>
        </div>
      </div>
    </div>
  );
};

// --- TECH DATA MODAL ---
export const TechModal: React.FC<{ lead: Lead | null; onClose: () => void }> = ({ lead, onClose }) => {
  if (!lead) return null;
  const meta = lead.metadata ? JSON.parse(lead.metadata) : {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2"><Smartphone size={20} className="text-amber-500"/><h3 className="font-bold">Dados Digitais</h3></div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
           <div className="p-6 border-r border-slate-100 space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase">Rede</h4>
              <div className="flex gap-3"><Globe className="text-blue-500" size={18} /><div><p className="text-xs text-slate-500">IP</p><p className="font-mono text-sm">{lead.ip || 'N/A'}</p></div></div>
              <div className="flex gap-3"><Fingerprint className="text-purple-500" size={18} /><div><p className="text-xs text-slate-500">Fingerprint</p><p className="font-mono text-sm break-all">{meta.fingerprint || 'N/A'}</p></div></div>
           </div>
           <div className="p-6 bg-slate-50 space-y-3">
              <h4 className="text-sm font-bold text-slate-500 uppercase">Dispositivo</h4>
              <div className="text-sm space-y-2">
                 <div><p className="text-xs text-slate-500">User Agent</p><div className="bg-white border p-2 rounded text-xs break-words h-20 overflow-y-auto">{meta.userAgent || 'N/A'}</div></div>
                 <div className="grid grid-cols-2 gap-2">
                    <div><p className="text-xs text-slate-500">Tela</p><p className="font-medium">{meta.screen}</p></div>
                    <div><p className="text-xs text-slate-500">OS</p><p className="font-medium">{meta.platform}</p></div>
                 </div>
              </div>
           </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t flex justify-end"><button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm">Fechar</button></div>
      </div>
    </div>
  );
};

// --- LEAD DETAILS MODAL ---
export const LeadDetailsModal: React.FC<{ lead: Lead | null; onClose: () => void; onSave: (notes: string) => Promise<void>; onDelete: (id: number) => void }> = ({ lead, onClose, onSave, onDelete }) => {
  const [notes, setNotes] = useState('');
  
  useEffect(() => { if (lead) setNotes(lead.notes || ''); }, [lead]);
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
           <h3 className="font-bold text-slate-800">Detalhes do Cliente</h3>
           <button onClick={onClose} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
           <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-500 font-bold">NOME</p><p>{lead.name}</p></div>
              <div><p className="text-xs text-slate-500 font-bold">WHATSAPP</p><p>{lead.whatsapp}</p></div>
              <div><p className="text-xs text-slate-500 font-bold">ESTADO</p><p>{lead.state || '-'}</p></div>
              <div><p className="text-xs text-slate-500 font-bold">TIPO</p><p>{lead.type}</p></div>
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Anotações Internas</label>
              <textarea className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none text-sm" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
           </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
           <button onClick={() => onDelete(lead.id)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"><Trash2 size={16} /> Excluir</button>
           <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium">Fechar</button>
              <button onClick={() => onSave(notes)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"><Save size={16} /> Salvar</button>
           </div>
        </div>
      </div>
    </div>
  );
};