import React from 'react';
import { UserProfile, Broker } from '../types';
import { ShieldAlert, Award, Star, Globe, Lock, Mail, CreditCard, ChevronRight } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  activeBroker: Broker;
  operationsCount: number;
}

export default function ProfileView({ profile, activeBroker, operationsCount }: ProfileViewProps) {
  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Card and status */}
        <div className="lg:col-span-8 bg-[#121216] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between border-b border-white/5 pb-5">
            <div className="flex flex-col md:flex-row items-center space-y-3.5 md:space-y-0 md:space-x-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center font-black text-2xl text-black shadow-lg shadow-cyan-500/10 select-none">
                {profile.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-extrabold text-white text-lg tracking-tight flex items-center justify-center md:justify-start gap-2">
                  <span>{profile.name}</span>
                  <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase animate-pulse">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>VIP Premium</span>
                  </span>
                </h3>
                <p className="text-xs text-white/40 mt-1 flex items-center justify-center md:justify-start gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-white/20" />
                  <span>{profile.email}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 bg-[#0a0a0c] border border-white/5 rounded-2xl px-5 py-3 text-center md:text-right shadow-inner">
              <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Saldo do Robô</p>
              <p className="text-xl font-black font-mono text-emerald-400 mt-0.5">R$ {profile.balance.toFixed(2)}</p>
            </div>
          </div>

          {/* Integration Status info */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Serviços e Vinculações Atuais</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Connected Broker Widget */}
              <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Corretora Ativa</p>
                  <p className="text-sm font-extrabold text-white">{activeBroker.name}</p>
                  <p className="text-[11px] text-white/40 truncate max-w-[180px]">{activeBroker.url}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${activeBroker.color} text-white font-bold select-none text-xl`}>
                  {activeBroker.logo}
                </div>
              </div>

              {/* API Integration Key */}
              <div className="bg-[#0a0a0c] p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Terminal Integrado</p>
                  <p className="text-sm font-extrabold text-white">IA_ROBOT_CORE_V4</p>
                  <p className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                    <span>Conexão Segura Ativa</span>
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#121216] border border-white/5 text-white/40">
                  <Globe className="w-6 h-6" />
                </div>
              </div>

            </div>
          </div>

          {/* Account Details list */}
          <div className="border-t border-white/5 pt-5 space-y-2 text-xs">
            <div className="flex justify-between py-2 text-white/40 border-b border-white/5">
              <span>Nível de Acesso</span>
              <span className="text-white font-bold">VIP Premium (vitalício)</span>
            </div>
            <div className="flex justify-between py-2 text-white/40 border-b border-white/5">
              <span>Total de Sinais Executados</span>
              <span className="text-white font-mono font-bold">{operationsCount} entradas</span>
            </div>
            <div className="flex justify-between py-2 text-white/40">
              <span>Último Login Registrado</span>
              <span className="text-white font-mono">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Security guidelines */}
        <div className="lg:col-span-4 bg-[#121216] border border-white/5 rounded-3xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl w-11 h-11 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Aviso de Segurança</h4>
            <p className="text-xs text-white/40 mt-2 leading-relaxed">
              As conexões de automação inteligente do **Aeromilion** são encriptadas de ponta a ponta com as corretoras integradas.
            </p>
            <p className="text-xs text-white/40 mt-2 leading-relaxed">
              Nunca compartilhe suas chaves de acesso ou detalhes de login do painel de automação com terceiros.
            </p>
          </div>

          <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-white/80 font-bold uppercase">Senhas Criptografadas</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20" />
          </div>
        </div>

      </div>

    </div>
  );
}
