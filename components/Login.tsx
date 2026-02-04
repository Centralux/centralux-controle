
import React, { useState } from 'react';
import { User } from '../types';
import Logo from './Logo';

interface LoginProps {
  users: User[];
  onLogin: (user: User) => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciais inválidas. Verifique usuário e senha.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-sky-500/30 w-full max-w-md p-8 rounded-3xl shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center mb-8">
          <Logo className="h-10 mb-4" />
          <h2 className="text-xl font-black text-white uppercase tracking-widest italic">Acesso Restrito</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Identifique-se para editar dados</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-2">Usuário</label>
            <input 
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none text-white focus:border-sky-500 transition-all font-bold"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Digite seu login"
            />
          </div>
          <div>
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-2">Senha</label>
            <input 
              type="password"
              required
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none text-white focus:border-sky-500 transition-all font-bold"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] p-3 rounded-xl font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-400 text-white p-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-sky-500/10 active:scale-95 mt-4"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
