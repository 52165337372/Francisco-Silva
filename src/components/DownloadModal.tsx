import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Download, 
  Smartphone, 
  Laptop, 
  Chrome, 
  FileText, 
  Check, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
}

export default function DownloadModal({ isOpen, onClose, userEmail, userName }: DownloadModalProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerDownload = (type: 'android' | 'windows' | 'extension' | 'credentials') => {
    setDownloading(type);
    
    setTimeout(() => {
      let filename = '';
      let fileContent = '';

      if (type === 'credentials') {
        filename = `aeromilion_credenciais_vip_${userName.replace(/\s+/g, '_').toLowerCase()}.txt`;
        fileContent = `============================================================
           AEROMILION - CENTRAL DE SINAIS IA v4.2
============================================================

Olá ${userName},
Seu acesso VIP VITALÍCIO foi liberado com sucesso!

Para utilizar a automação do Aeromilion diretamente no seu
dispositivo Android, Windows ou como Extensão do Chrome:

[ CREDENCIAIS DE ACESSO ]
- Usuário: ${userName}
- E-mail: ${userEmail}
- Chave de Ativação VIP: VIP_VITALICIO_AEROMILION_4fa9b21f3a

[ PASSOS PARA INSTALAÇÃO DO APP ]
1. Caso tenha baixado o aplicativo Android (.apk):
   - Transfira o arquivo para seu celular.
   - Permita a instalação de fontes desconhecidas nas configurações do Android.
   - Instale e faça o login com seu e-mail cadastrado.
   
2. Caso tenha baixado o aplicativo Desktop (.exe):
   - Execute o instalador 'aeromilion_setup.exe'.
   - O aplicativo se integrará diretamente ao seu navegador para ler os padrões do Aviator e Mines.
   
3. Caso utilize a Extensão do Chrome (.zip):
   - Descompacte o arquivo zip.
   - Acesse chrome://extensions no seu navegador Chrome.
   - Ative o 'Modo do desenvolvedor' no canto superior direito.
   - Clique em 'Carregar sem compactação' e selecione a pasta descompactada.

Agradecemos a sua preferência e confiança!
Equipe de Tecnologia Aeromilion - Sinais com 98.4% de Assertividade.
============================================================`;
      } else if (type === 'android') {
        filename = 'aeromilion_mobile_v4.2.apk';
        fileContent = `MOCK_APK_FILE_DATA_AEROMILION_VIP_V4_2\nInstale este arquivo em seu celular Android para rodar o robô de sinais em segundo plano.\nE-mail autorizado: ${userEmail}\nChave de licença: VIP_VITALICIO_AEROMILION_4fa9b21f3a`;
      } else if (type === 'windows') {
        filename = 'aeromilion_desktop_installer.exe';
        fileContent = `MOCK_EXE_FILE_DATA_AEROMILION_DESKTOP_VIP_V4_2\nExecute este instalador em seu computador Windows de 64 bits para integrar a automação.\nE-mail autorizado: ${userEmail}\nLicença ativa: VIP_VITALICIO`;
      } else {
        filename = 'aeromilion_chrome_extension.zip';
        fileContent = `MOCK_ZIP_FILE_DATA_AEROMILION_CHROME_EXTENSION_V4_2\nExtensão oficial do Aeromilion para navegadores baseados no Chromium.\nInstale no Chrome em modo desenvolvedor para sinalização automática.`;
      }

      // Create blob and download
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloading(null);
      setDownloadSuccess(type);
      setTimeout(() => setDownloadSuccess(null), 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-[#121216] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0a0a0c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight uppercase">Central de Downloads</h2>
              <p className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">AEROMILION INSTALADORES OFICIAIS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="bg-cyan-500/5 border border-cyan-500/10 p-4 rounded-2xl space-y-2">
            <p className="text-xs text-cyan-400 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Sincronização Direta de Baixa Latência</span>
            </p>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Baixe os instaladores autorizados do <strong className="text-white">Aeromilion Sinais IA</strong> para seu computador, celular ou navegador Chrome. Nosso aplicativo nativo lê os milissegundos das rodadas das corretoras e executa a automação de alta assertividade (98.4%) de forma contínua, mesmo com a tela do celular apagada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Option 1: Android */}
            <div className="bg-[#0a0a0c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="p-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl w-10 h-10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase">Aplicativo Android</h3>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">Versão v4.2 (.apk)</p>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Para rodar no celular de forma portátil. Alertas de vela diretamente na barra de notificações.
                </p>
              </div>

              <button
                disabled={downloading !== null}
                onClick={() => triggerDownload('android')}
                className={`w-full py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  downloadSuccess === 'android'
                    ? 'bg-green-500 text-[#0a0a0c]'
                    : downloading === 'android'
                    ? 'bg-white/5 text-white/40 cursor-wait'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                }`}
              >
                {downloadSuccess === 'android' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Concluído</span>
                  </>
                ) : downloading === 'android' ? (
                  <span className="animate-pulse">Baixando...</span>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Instalar APK (18M)</span>
                  </>
                )}
              </button>
            </div>

            {/* Option 2: Windows */}
            <div className="bg-[#0a0a0c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl w-10 h-10 flex items-center justify-center">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase">Aplicativo Windows</h3>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">Versão v4.2 (.exe)</p>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Terminal completo para computadores. Permite automação direta em abas de navegador em paralelo.
                </p>
              </div>

              <button
                disabled={downloading !== null}
                onClick={() => triggerDownload('windows')}
                className={`w-full py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  downloadSuccess === 'windows'
                    ? 'bg-green-500 text-[#0a0a0c]'
                    : downloading === 'windows'
                    ? 'bg-white/5 text-white/40 cursor-wait'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                }`}
              >
                {downloadSuccess === 'windows' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Concluído</span>
                  </>
                ) : downloading === 'windows' ? (
                  <span className="animate-pulse">Baixando...</span>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar EXE (42M)</span>
                  </>
                )}
              </button>
            </div>

            {/* Option 3: Chrome Extension */}
            <div className="bg-[#0a0a0c] border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="p-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl w-10 h-10 flex items-center justify-center">
                  <Chrome className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase">Extensão Chrome</h3>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">Velas e Sinais (.zip)</p>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Extensão leve instalada diretamente no Chrome. Conecta em tempo real nas corretoras integradas.
                </p>
              </div>

              <button
                disabled={downloading !== null}
                onClick={() => triggerDownload('extension')}
                className={`w-full py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  downloadSuccess === 'extension'
                    ? 'bg-green-500 text-[#0a0a0c]'
                    : downloading === 'extension'
                    ? 'bg-white/5 text-white/40 cursor-wait'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                }`}
              >
                {downloadSuccess === 'extension' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Concluído</span>
                  </>
                ) : downloading === 'extension' ? (
                  <span className="animate-pulse">Baixando...</span>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Extensão (3M)</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Verification section */}
          <div className="bg-[#0a0a0c] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-cyan-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase">Token e Licença de Ativação VIP</h4>
                <p className="text-[10px] text-white/40">Seu código pessoal de autenticação e passos em arquivo de texto.</p>
              </div>
            </div>

            <button
              disabled={downloading !== null}
              onClick={() => triggerDownload('credentials')}
              className={`py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                downloadSuccess === 'credentials'
                  ? 'bg-green-500 text-black'
                  : downloading === 'credentials'
                  ? 'bg-white/5 text-white/40 cursor-wait'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
              }`}
            >
              {downloadSuccess === 'credentials' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Token Baixado!</span>
                </>
              ) : downloading === 'credentials' ? (
                <span className="animate-pulse">Gerando...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Token de Licença VIP</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0a0c] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-white/30 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Todos os arquivos verificados contra vírus e malware.</span>
          </span>
          <span>Chave de Licença Ativa: VIP_VITALICIO</span>
        </div>
      </motion.div>
    </div>
  );
}
