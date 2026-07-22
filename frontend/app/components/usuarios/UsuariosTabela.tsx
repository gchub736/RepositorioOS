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

// Badge de "ordens ativas" — reutilizado na tabela (desktop) e no card (mobile).
function OrdensBadge({ ordens }: { ordens: number }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-black whitespace-nowrap ${
        ordens === 0
          ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          : ordens >= 3
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      }`}
    >
      {ordens === 0 ? "Nenhuma" : `${ordens} Ativa${ordens > 1 ? "s" : ""}`}
    </span>
  );
}

// Seletor de cargo — mesmo controle nas duas variantes.
function SeletorCargo({
  user,
  alterarCargo,
}: {
  user: Usuario;
  alterarCargo: (id: number, cargo: string) => void;
}) {
  return (
    <select
      value={(user.cargo as any)?.nome || user.cargo || "Usuario"}
      onChange={(e) => alterarCargo(user.id, e.target.value)}
      className="text-xs p-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
    >
      <option value="Usuario">Usuário</option>
      <option value="Tecnico">Técnico</option>
      <option value="Admin">Admin</option>
    </select>
  );
}

// Botão de excluir — desabilitado para o próprio usuário logado.
function BotaoExcluir({
  user,
  ehEuMesmo,
  excluirUsuario,
}: {
  user: Usuario;
  ehEuMesmo: boolean;
  excluirUsuario: (id: number, nome: string) => void;
}) {
  return (
    <button
      onClick={() => excluirUsuario(user.id, user.nome)}
      disabled={ehEuMesmo}
      title="Excluir"
      className={`p-2 rounded-md flex-shrink-0 ${
        ehEuMesmo
          ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
          : "text-slate-500 dark:text-white hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
      } transition-colors`}
    >
      <Trash2 size={16} />
    </button>
  );
}

// Tabela de usuários cadastrados. Desktop (md+): <table>. Mobile: lista de cards
// (a tabela tem largura mínima e não cabe em telas estreitas).
export default function UsuariosTabela({
  usuarios,
  carregando,
  meuId,
  alterarCargo,
  excluirUsuario,
}: Props) {
  const vazio = !carregando && usuarios.length === 0;

  return (
    <>
      {/* ===== DESKTOP (xl+): tabela ===== */}
      <div className="hidden xl:block bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-300 dark:border-slate-800 overflow-auto max-w-full flex-1 min-h-0">
        <table className="w-full min-w-[720px] text-left text-[11px] table-fixed">
          <thead className="bg-blue-900 text-white font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[8%] text-center">ID</th>
              <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[27%]">Nome</th>
              <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[20%] text-center">CPF</th>
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
            {vazio && (
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
                    <td className="px-3 py-3 text-center overflow-hidden align-middle text-[11px] text-slate-600 dark:text-slate-300">
                      {formatarCpf(user.cpf)}
                    </td>
                    <td className="px-3 py-3 text-center align-middle">
                      <OrdensBadge ordens={ordensAtivas} />
                    </td>
                    <td className="px-3 py-3 text-center align-middle">
                      <SeletorCargo user={user} alterarCargo={alterarCargo} />
                    </td>
                    <td className="px-3 py-3 text-center align-middle">
                      <BotaoExcluir user={user} ehEuMesmo={ehEuMesmo} excluirUsuario={excluirUsuario} />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE/TABLET (< xl): cards ===== */}
      <div className="xl:hidden flex flex-col gap-3">
        {carregando && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 p-6 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600 italic text-sm">
            <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <span>Carregando usuários...</span>
          </div>
        )}
        {vazio && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 p-6 text-center text-slate-400 dark:text-slate-600 italic text-sm">
            Nenhum usuário encontrado.
          </div>
        )}
        {!carregando &&
          usuarios.map((user) => {
            const ehEuMesmo = String(user.id) === String(meuId);
            const ordensAtivas = user.ordens_ativas || 0;
            return (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 shadow-sm p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-blue-900 dark:text-blue-400 font-mono">#{user.id}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate mt-0.5">
                      {user.nome}{" "}
                      {ehEuMesmo && <span className="text-[9px] text-blue-400 font-normal">(você)</span>}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      {formatarCpf(user.cpf)}
                    </p>
                  </div>
                  <BotaoExcluir user={user} ehEuMesmo={ehEuMesmo} excluirUsuario={excluirUsuario} />
                </div>
                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest flex-shrink-0">
                    Ordens
                  </span>
                  <OrdensBadge ordens={ordensAtivas} />
                </div>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest flex-shrink-0">
                    Cargo
                  </span>
                  <SeletorCargo user={user} alterarCargo={alterarCargo} />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
