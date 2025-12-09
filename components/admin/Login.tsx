import React, { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (u: string, p: string) => Promise<void>;
  loading: boolean;
  error: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, loading, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

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
        
        {error && (
           <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100 break-words">
             {error}
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5"/> : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};