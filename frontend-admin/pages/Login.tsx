
import React, { useState } from 'react';
import { ShieldCheck, Activity, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginProps {
  onLogin: (creds: { username: string; password: string }) => void;
  loading: boolean;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className="h-screen w-full bg-slate-100 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[48px] shadow-2xl w-full max-w-md border border-slate-200 text-center"
      >
        <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-indigo-100">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Command Center</h1>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3 mb-10">Authorized Personnel Only</p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Username</label>
            <input 
              type="text" 
              placeholder="admin" 
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-gray-900 placeholder-slate-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-gray-900 placeholder-slate-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading || !username || !password}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Access Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
