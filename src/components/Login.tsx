import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, Star, Sparkles, Shield, User } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (name: string, email: string) => void;
  userEmail: string;
}

export default function Login({ onLoginSuccess, userEmail }: LoginProps) {
  const [email, setEmail] = useState<string>(userEmail || 'FCS.SILVA554@gmail.com');
  const [password, setPassword] = useState<string>('******');
  const [name, setName] = useState<string>('FCS SILVA');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor preencha todos os campos.');
      return;
    }
    if (isRegistering && !name) {
      setError('Por favor preencha o seu nome.');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate login loading delay
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(isRegistering ? name : 'FCS SILVA', email);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e1e1e6] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[280px] h-[280px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
 
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#121216] border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10 overflow-hidden"
      >
        
        {/* Animated glowing top cyan bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 animate-pulse" />
 
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          {/* Main Logo Container */}
          <div className="relative group select-none">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 group-hover:opacity-40 blur-md transition duration-500" />
            <div className="relative w-20 h-20 bg-[#0a0a0c] rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
              <img 
                src="https://media.base44.com/images/public/6a4e7796e7685da4b5210a7f/6d1691f46_logo.png" 
                alt="Aeromilion Logo" 
                className="w-14 h-14 object-contain filter drop-shadow-[0_4px_10px_rgba(6,182,212,0.5)] rotate-12 transition group-hover:rotate-0 duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
 
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase font-display">
              Aeromilion <span className="text-cyan-500">IA</span>
            </h1>
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mt-0.5">ROBÔ DE SINAIS IA v4.2</p>
          </div>
 
          <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-black px-3 py-1 rounded-full flex items-center space-x-1.5 uppercase tracking-wide select-none">
            <Star className="w-3.5 h-3.5 fill-cyan-400 animate-spin-slow" />
            <span>ACESSO VIP ATIVO</span>
          </div>
        </div>
 
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl mb-4 text-center font-semibold">
            {error}
          </div>
        )}
 
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Nome Completo</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-white/30" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none transition-colors"
                  placeholder="Nome do usuário"
                />
              </div>
            </div>
          )}
 
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">E-mail de Acesso</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-white/30" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-white/10 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none transition-colors"
                placeholder="Ex: FCS.SILVA554@gmail.com"
              />
            </div>
          </div>
 
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Senha de Acesso</label>
              {!isRegistering && (
                <a href="#forgot" className="text-[10px] text-cyan-400 hover:underline">Esqueceu a senha?</a>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-white/30" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-white/10 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none transition-colors"
                placeholder="Insira sua senha"
              />
            </div>
          </div>
 
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-[#0a0a0c] transition font-black py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 mt-6 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{isRegistering ? 'Criar Conta Premium' : 'Entrar no Aeromilion'}</span>
              </>
            )}
          </button>
        </form>
 
        <div className="mt-6 pt-5 border-t border-white/5 text-center">
          <p className="text-xs text-white/40">
            {isRegistering ? 'Já possui licença VIP?' : 'Recebeu chave VIP via WhatsApp?'}{' '}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-cyan-400 hover:underline font-bold"
            >
              {isRegistering ? 'Faça login aqui' : 'Cadastre-se aqui'}
            </button>
          </p>
        </div>
 
        <div className="mt-6 flex justify-center items-center space-x-4 text-[10px] text-white/30 font-mono uppercase tracking-widest">
          <span className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-cyan-500" />
            <span>Protegido SSL</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Sinais IA v4</span>
          </span>
        </div>
 
      </motion.div>
    </div>
  );
}
