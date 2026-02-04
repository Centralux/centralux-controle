
import React, { useState } from 'react';
import { Employee, TimeEntry, User } from '../types';
import { createCloudStorage, updateCloudStorage } from '../utils/syncService';

interface DataManagementProps {
  employees: Employee[];
  entries: TimeEntry[];
  onImport: (employees: Employee[], entries: TimeEntry[]) => void;
  users: User[];
  currentUser: User;
  onAddUser: (user: Omit<User, 'id'>) => void;
  cloudId: string | null;
  onSetCloudId: (id: any) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ 
  employees, entries, onImport, users, currentUser, onAddUser, cloudId, onSetCloudId
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    setSyncMessage('Sincronizando com a nuvem...');
    
    try {
      const dataToSync = {
        employees,
        entries,
        syncDate: new Date().toISOString(),
        version: "1.0"
      };

      let id = cloudId;
      
      if (!id) {
        // Criar novo ID na nuvem
        id = await createCloudStorage(dataToSync);
        if (id) {
          onSetCloudId(id);
          setSyncMessage(`✅ Dados sincronizados! ID: ${id}`);
        } else {
          setSyncMessage('❌ Erro ao sincronizar. Tente novamente.');
        }
      } else {
        // Atualizar dados existentes
        const success = await updateCloudStorage(id, dataToSync);
        if (success) {
          setSyncMessage(`✅ Dados atualizados na nuvem!`);
        } else {
          setSyncMessage('❌ Erro ao atualizar. Tente novamente.');
        }
      }
    } catch (error) {
      setSyncMessage('❌ Erro na sincronização.');
    }
    
    setIsSyncing(false);
    setTimeout(() => setSyncMessage(''), 5000);
  };

  const copyShareLink = () => {
    if (!cloudId) {
      alert('Primeiro sincronize seus dados com a nuvem!');
      return;
    }
    
    const shareLink = `${window.location.origin}${window.location.pathname}?id=${cloudId}`;
    navigator.clipboard.writeText(shareLink);
    alert('✅ Link copiado para a área de transferência!\n\n' + shareLink);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER DA SEÇÃO */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Gestão de Dados</h2>
          <p className="text-slate-400 text-sm mt-1">Sincronize dados com a nuvem ou administre backups locais.</p>
        </div>
      </div>

      {/* SINCRONIZAÇÃO COM NUVEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SINCRONIZAR COM NUVEM */}
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl hover:border-emerald-500/30 transition-all group">
          <div className="mb-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Sincronizar Nuvem
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Envie seus dados para a nuvem e gere um ID para compartilhar com outras pessoas. Todos verão os mesmos dados em tempo real.
            </p>
            {cloudId && (
              <p className="text-emerald-400 text-xs mt-2 font-mono bg-slate-950/50 p-2 rounded">
                ID: {cloudId}
              </p>
            )}
          </div>
          
          <button 
            onClick={handleSyncToCloud}
            disabled={isSyncing}
            className="w-full bg-slate-800 hover:bg-emerald-600 disabled:bg-slate-700 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all border border-slate-700 hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {isSyncing ? 'SINCRONIZANDO...' : cloudId ? 'ATUALIZAR NUVEM' : 'SINCRONIZAR AGORA'}
          </button>
          
          {syncMessage && (
            <p className={`text-xs mt-3 ${syncMessage.includes('✅') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {syncMessage}
            </p>
          )}
        </div>

        {/* COMPARTILHAR LINK */}
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl hover:border-sky-500/30 transition-all group">
          <div className="mb-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
              Compartilhar Link
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Copie o link de compartilhamento e envie para outras pessoas. Elas verão todos os seus dados sem precisar fazer login.
            </p>
          </div>

          <button 
            onClick={copyShareLink}
            disabled={!cloudId}
            className="w-full bg-slate-800 hover:bg-sky-600 disabled:bg-slate-700 disabled:text-slate-500 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all border border-slate-700 hover:border-sky-400 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
          >
            {cloudId ? 'COPIAR LINK' : 'SINCRONIZE PRIMEIRO'}
          </button>
        </div>
      </div>

      {/* BACKUP LOCAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EXPORTAR BACKUP */}
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl hover:border-sky-500/30 transition-all group">
          <div className="mb-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Exportar Backup
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Gere um arquivo com todos os registros atuais (funcionários e pontos) para guardar como segurança ou transferir para outro dispositivo.
            </p>
          </div>
          
          <button 
            onClick={() => {
              const dataToExport = {
                employees,
                entries,
                exportDate: new Date().toISOString(),
                version: "1.0"
              };
              const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `centralux_ponto_backup_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full bg-slate-800 hover:bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all border border-slate-700 hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            GERAR ARQUIVO .JSON
          </button>
        </div>

        {/* IMPORTAR DADOS */}
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl hover:border-sky-500/30 transition-all group">
          <div className="mb-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
              Restaurar Dados
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Substitua todos os dados atuais carregando um arquivo de backup gerado anteriormente. <span className="text-rose-400 font-bold">Atenção:</span> Isso apagará os dados atuais.
            </p>
          </div>

          <label className="block">
            <span className="sr-only">Escolher arquivo</span>
            <input 
              type="file" 
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                if (!window.confirm("Isso substituirá todos os seus dados atuais. Deseja continuar?")) {
                  e.target.value = '';
                  return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const data = JSON.parse(event.target?.result as string);
                    if (data.employees && data.entries) {
                      onImport(data.employees, data.entries);
                      alert("✅ Backup restaurado com sucesso!");
                    } else {
                      throw new Error("Formato inválido");
                    }
                  } catch (err) {
                    alert("❌ Erro: O arquivo selecionado não é um backup válido da CentraLux.");
                  }
                };
                reader.readAsText(file);
                e.target.value = '';
              }}
              className="w-full text-xs text-slate-400
                file:mr-4 file:py-4 file:px-8
                file:rounded-xl file:border-0
                file:text-[10px] file:font-black file:uppercase file:tracking-widest
                file:bg-sky-500 file:text-white
                hover:file:bg-sky-400 cursor-pointer
                file:transition-all"
            />
          </label>
        </div>
      </div>

      {/* FOOTER INFORMATIVO */}
      <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-2xl text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          CentraLux Ponto Digital • Sistema de Gestão Interna • Liang Solution
        </p>
      </div>
    </div>
  );
};

export default DataManagement;
