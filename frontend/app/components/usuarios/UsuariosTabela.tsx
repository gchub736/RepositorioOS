"use client";
import { Trash2 } from "lucide-react";
import { formatarCpf } from "../../lib/formatters";
import { Usuario } from "../../types";

interface Props {
  usuarios: Usuario[];
  carregando: boolean;
  meuId: string | null;
  alterarCargo: (userId: number, novoCargo: string) => void;
  excluirUsuario: (userId: number, userName: string) => void;
}

// Tabela de usuários cadastrados, com seletor de cargo e exclusão por linha.
export default function UsuariosTabela({
  usuarios,
  carregando,
  meuId,
  alterarCargo,
  excluirUsuario,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-300 dark:border-slate-800 overflow-auto max-w-full flex-1 min-h-0">
      <table className="w-full min-w-[720px] text-left text-[11px] table-fixed">
        <thead className="bg-blue-900 text-white font-bold uppercase text-[10px] tracking-widest">
          <tr>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[8%] text-center">ID</th>
            <th className="sticky top-0 z-10 bg-blue-900 pl-8 pr-3 py-3 w-[27%]">Nome</th>
            <th className="sticky top-0 z-10 bg-blue-900 pl-9 pr-3 py-3 w-[20%]">CPF</th>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[15%] text-center">Ordens Ativas</th>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[15%] text-center">Cargo</th>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[15%] text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300 dark:divide-slate-800">
          {carregando && (
            <tr>
              <td colSpan={6} className="px-3 py-10 text-center text-slate-400 dark:text-slate-600 italic text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Carregando usuários...</span>
                </div>
              </td>
            </tr>
          )}
          {!carregando && usuarios.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-10 text-center text-slate-400 dark:text-slate-600 italic text-sm">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
          {!carregando &&
            usuarios.map((user) => {
              const ehEuMesmo = String(user.id) === String(meuId);
              const ordensAtivas = user.ordens_ativas || 0;

              return (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-3 py-3 text-center align-middle text-[10px] text-blue-900 dark:text-blue-400 font-mono">
                    #{user.id}
                  </td>
                  <td className="px-3 py-3 overflow-hidden align-middle">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate block">
                      {user.nome}{" "}
                      {ehEuMesmo && <span className="text-[9px] text-blue-400 font-normal">(você)</span>}
                    </span>
                  </td>
                  <td className="px-3 py-3 overflow-hidden align-middle text-[11px] text-slate-600 dark:text-slate-300">
                    {formatarCpf(user.cpf)}
                  </td>
                  <td className="px-3 py-3 text-center align-middle">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        ordensAtivas === 0
                          ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                          : ordensAtivas >= 3
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {ordensAtivas === 0 ? "Nenhuma" : `${ordensAtivas} Ativa${ordensAtivas > 1 ? "s" : ""}`}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center align-middle">
                    <select
                      value={(user.cargo as any)?.nome || user.cargo || "Usuario"}
                      onChange={(e) => alterarCargo(user.id, e.target.value)}
                      className="text-xs p-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="Usuario">Usuário</option>
                      <option value="Tecnico">Técnico</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-3 py-3 text-center align-middle">
                    <button
                      onClick={() => excluirUsuario(user.id, user.nome)}
                      disabled={ehEuMesmo}
                      title="Excluir"
                      className={`p-2 rounded-md ${
                        ehEuMesmo
                          ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
                          : "text-slate-500 dark:text-white hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
                      } transition-colors`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
