import React, { useState } from 'react';
import { Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess, isModal = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    type: 'Aposentadoria'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState({ name: '', whatsapp: '' });

  // Formata telefone (XX) XXXXX-XXXX
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers.replace(/^(\d{0,2})/, '($1');
    if (numbers.length <= 7) return numbers.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    return numbers.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, whatsapp: formatted });
    if (errors.whatsapp) setErrors({ ...errors, whatsapp: '' });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
    if (errors.name) setErrors({ ...errors, name: '' });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', whatsapp: '' };

    // Validação Nome (Mínimo 2 palavras)
    const nameParts = formData.name.trim().split(/\s+/);
    if (nameParts.length < 2 || nameParts[1].length < 1) {
      newErrors.name = 'Por favor, digite seu nome e sobrenome.';
      isValid = false;
    }

    // Validação Telefone (Mínimo 10 dígitos - DDD + 8 ou 9)
    const phoneDigits = formData.whatsapp.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      newErrors.whatsapp = 'Digite um número de telefone válido com DDD.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        // Não resetamos mais o status nem chamamos onSuccess automaticamente.
        // A mensagem de sucesso ficará fixa na tela.
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div id="contato" className={`w-full max-w-lg mx-auto relative group ${isModal ? '' : ''}`}>
      {/* Efeito de brilho no fundo (apenas se não for modal para não poluir o popup) */}
      {!isModal && (
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      )}
      
      <div className={`relative bg-white rounded-xl ${isModal ? '' : 'shadow-2xl border border-slate-100'} p-8`}>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Análise Gratuita do Caso</h3>
          <p className="text-slate-500">Preencha abaixo e um especialista entrará em contato rapidamente.</p>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3">Solicitação Recebida com Sucesso!</h4>
            <div className="text-slate-600 space-y-2">
              <p>Nossa equipe já está analisando seus dados.</p>
              <p className="font-medium text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-100 leading-relaxed">
                Fique tranquilo(a): entendemos a urgência e a importância do seu caso. Um advogado especialista vai revisar suas informações e entrará em contato pelo WhatsApp o mais breve possível para te orientar sobre os próximos passos.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                placeholder="Ex: João da Silva"
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-500'} focus:ring-2 transition-all outline-none`}
                value={formData.name}
                onChange={handleNameChange}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp (com DDD)</label>
              <input 
                type="tel" 
                placeholder="(11) 99999-9999"
                className={`w-full px-4 py-3 rounded-lg border ${errors.whatsapp ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-amber-500'} focus:ring-2 transition-all outline-none`}
                value={formData.whatsapp}
                onChange={handlePhoneChange}
                maxLength={15}
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.whatsapp}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Ajuda</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none appearance-none bg-white"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Aposentadoria">Aposentadoria Negada</option>
                  <option value="Auxílio Doença">Auxílio Doença</option>
                  <option value="BPC/LOAS">BPC / LOAS</option>
                  <option value="Pensão">Pensão por Morte</option>
                  <option value="Revisão">Revisão de Valor</option>
                  <option value="Outros">Outros Assuntos</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="animate-spin" /> Processando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Solicitar Ajuda Agora
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};