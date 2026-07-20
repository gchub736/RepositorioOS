'use client'
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, UserPlus, Users, BarChart3, Settings, LogOut, Sun, Moon, ChevronLeft, Menu, Bell, CheckCheck } from 'lucide-react';
import api from '../services/api';

export default function Sidebar() {
  const [cargo, setCargo] = useState('');
  const [nome, setNome] = useState('');
  const [theme, setTheme] = useState('light');
  const [nomeSistema, setNomeSistema] = useState('Central de Suporte Técnico');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [showNotificacoes, setShowNotificacoes] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Rotas públicas de autenticação (login, cadastro, recuperar/redefinir senha).
  // A sidebar não aparece nelas e não deve buscar perfil/notificações (sem token).
  const isRotaAuth = pathname?.startsWith('/login') ?? false;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        const target = event.target as Element;
        if (!target.closest('#btn-notificacoes')) {
          setShowNotificacoes(false);
        }
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowNotificacoes(false);
      }
    }

    if (showNotificacoes) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNotificacoes]);

  const fetchNotificacoes = () => {
    if (isRotaAuth) return;
    api.get('/notificacoes')
      .then(res => {
        setNotificacoes(res.data || []);
      })
      .catch(err => console.error("Erro ao carregar notificações", err));
  };

  const [initialized, setInitialized] = useState(false);

  // 1. Inicialização (Roda quando sai da tela de login)
  useEffect(() => {
    if (isRotaAuth) {
      setInitialized(false);
      return;
    }

    if (initialized) return;

    // UX rápida / Preferências locais síncronas
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    setNomeSistema(localStorage.getItem('cfg_nomeSistema') || 'Central de Suporte Técnico');
    setIsCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    // Inicializa valores locais para resposta visual rápida
    setCargo(sessionStorage.getItem('usuarioCargo') || '');
    setNome(sessionStorage.getItem('usuarioNome') || '');

    // Busca dados reais do perfil para garantir a proteção
    api.get('/perfil')
      .then(res => {
        const eu = res.data;
        const cargoReal = eu.cargo?.nome || eu.cargo || '';
        const nomeReal = eu.nome || '';

        setCargo(cargoReal);
        setNome(nomeReal);

        // Sincroniza localStorage (UX rápida)
        sessionStorage.setItem('usuarioCargo', cargoReal);
        sessionStorage.setItem('usuarioNome', nomeReal);
      })
      .catch(err => {
        // Se falhar (não autenticado ou sessão expirada) e não estamos no login, redireciona
        sessionStorage.clear();
        router.push('/login');
      });

    setInitialized(true);
  }, [pathname, initialized]);

  // Responsivo: em telas menores (< lg) força o modo recolhido (trilho de ícones),
  // reutilizando a preferência salva ao voltar para o desktop.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const aplicar = () => {
      setIsMobile(mq.matches);
      if (mq.matches) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
      }
    };
    aplicar();
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, []);

  // 3. Notificações Polling e Eventos (Separado da inicialização para não ser limpo prematuramente)
  useEffect(() => {
    if (isRotaAuth) return;

    fetchNotificacoes();
    const interval = setInterval(fetchNotificacoes, 30000);

    const handleAtualizarNotificacoes = () => {
      fetchNotificacoes();
    };

    window.addEventListener('notificacoes:atualizar', handleAtualizarNotificacoes);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notificacoes:atualizar', handleAtualizarNotificacoes);
    };
  }, [pathname]);

  // 2. Proteção de rotas instantânea por pathname (Zero chamadas de rede no clique)
  useEffect(() => {
    if (isRotaAuth) return;

    // Esconde o popover de notificações ao mudar de página
    setShowNotificacoes(false);

    // Valida acessos baseado no cargo atual carregado localmente
    const currentCargo = cargo || sessionStorage.getItem('usuarioCargo') || '';
    if (currentCargo) {
      if (currentCargo === 'Usuario') {
        const rotasPermitidasUsuario = ['/', '/novo', '/configuracoes'];
        if (!rotasPermitidasUsuario.includes(pathname)) {
          router.push('/novo');
        }
      } else if (currentCargo === 'Tecnico') {
        if (pathname === '/usuarios' || pathname === '/estatisticas') {
          router.push('/');
        }
      }
    }
  }, [pathname, cargo, router]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    // No mobile o expandir/recolher é efêmero (drawer); não persiste para não
    // sobrescrever a preferência de layout do desktop.
    if (!isMobile) localStorage.setItem('sidebarCollapsed', String(newState));
  };

  // No mobile, fecha o drawer sempre que a rota muda (clique num item ou
  // redirecionamento por cargo), voltando ao trilho de ícones.
  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
  }, [pathname, isMobile]);

  const marcarTodasComoLidas = async () => {
    try {
      await api.put('/notificacoes/ler-todas');
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
    } catch (err) {
      console.error("Erro ao marcar todas como lidas", err);
    }
  };

  const marcarComoLida = async (id: number) => {
    try {
      await api.put(`/notificacoes/${id}/ler`);
      setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    } catch (err) {
      console.error("Erro ao marcar notificação como lida", err);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
    }
    sessionStorage.clear();
    router.push('/login');
  };

  if (isRotaAuth) return null;

  const unreadCount = notificacoes.filter((n: any) => !n.lida).length;

  // No mobile, a barra expandida vira um drawer sobreposto (flutua sobre o
  // conteúdo com um scrim atrás) em vez de empurrar/quebrar o layout.
  const mobileExpanded = isMobile && !isCollapsed;

  // ============================================================
  //  DESIGN INSTITUCIONAL - SIDEBAR POR CAMADAS
  // ============================================================

  const navItems = [
    { href: '/novo', icon: UserPlus, label: 'Criar Chamado', roles: ['Admin', 'Tecnico', 'Usuario'] },
    { href: '/', icon: ClipboardList, label: 'Chamados', roles: ['Admin', 'Tecnico', 'Usuario'] },
    { href: '/usuarios', icon: Users, label: 'Usuários', roles: ['Admin'] },
    { href: '/estatisticas', icon: BarChart3, label: 'Estatísticas', roles: ['Admin'] },
    { href: '/configuracoes', icon: Settings, label: 'Configurações', roles: ['Admin', 'Tecnico', 'Usuario'] },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    // Sem `overflow-hidden` na aside: o popover de notificações é filho dela e fica
    // posicionado fora dos seus limites (left-full), então seria recortado. Quem
    // arredonda os cantos são as camadas internas.
    <>
      {/* Scrim do drawer mobile: escurece o conteúdo e fecha ao tocar fora. */}
      {mobileExpanded && (
        <div
          onClick={() => setIsCollapsed(true)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}
      <aside
        className={`flex flex-col h-full transition-all duration-300 ${
          mobileExpanded
            ? 'fixed inset-y-0 left-0 z-50 w-[240px] shadow-2xl rounded-r-2xl animate-in slide-in-from-left duration-300'
            : `relative z-20 flex-shrink-0 rounded-2xl ${isCollapsed ? 'w-14' : 'w-[220px]'}`
        }`}
      >
      {/* ===== CAMADA BASE (z-0): Gradiente Navy Escuro ===== */}
      <div
        className="absolute inset-0 z-0 rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, #1e3a8a 0%, #020617 100%)',
        }}
      />

      {/* ===== CAMADA DE CONTEUDO (z-1) ===== */}
      <div className="relative z-10 flex flex-col h-full">

        {/* --- TOPO: Logo / Nome / Ações --- */}
        <div className={`flex flex-col ${isCollapsed ? 'items-center py-4 px-1 gap-3' : 'p-4 pb-3'}`}>
          {!isCollapsed ? (
            <>
              {/* Header expandido: saudação + ações */}
              <div className="flex items-center gap-2 mb-1">
                {/* Avatar placeholder */}
                <div className="w-8 h-8 rounded-full bg-navy-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-black">
                    {nome ? nome.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate leading-tight">
                    Olá, {nome || 'Usuario'}
                  </p>
                  <p className="text-blue-300/60 text-[9px] font-semibold uppercase tracking-wider truncate">
                    {cargo}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors flex-shrink-0"
                  title="Sair"
                >
                  <LogOut size={15} />
                </button>
              </div>

              {/* Ações: Notificação, Tema, Recolher */}
              <div className="flex items-center gap-0.5 mt-1">
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-slate-100 hover:text-white hover:bg-white/10 transition-colors"
                  title="Recolher"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  id="btn-notificacoes"
                  onClick={() => setShowNotificacoes(!showNotificacoes)}
                  className="p-1.5 rounded-lg text-slate-100 hover:text-white hover:bg-white/10 transition-colors relative"
                  title="Notificações"
                >
                  <Bell size={15} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-lg text-slate-100 hover:text-white hover:bg-white/10 transition-colors"
                  title="Alternar Tema"
                >
                  {theme === 'light' ? <Moon size={15} /> : <Sun size={15} className="text-yellow-400" />}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Header colapsado: avatar + ícones empilhados */}
              <div className="w-8 h-8 rounded-full bg-navy-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">
                  {nome ? nome.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg text-slate-100 hover:text-white hover:bg-white/10 transition-colors"
                title="Expandir Menu"
              >
                <Menu size={17} />
              </button>
              <button
                id="btn-notificacoes"
                onClick={() => setShowNotificacoes(!showNotificacoes)}
                className="p-1.5 rounded-lg text-slate-100 hover:text-white hover:bg-white/10 transition-colors relative"
                title="Notificações"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
              </button>
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-slate-100 hover:text-white hover:bg-white/10 transition-colors"
                title="Alternar Tema"
              >
                {theme === 'light' ? <Moon size={17} /> : <Sun size={17} className="text-yellow-400" />}
              </button>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
                title="Sair"
              >
                <LogOut size={17} />
              </button>
            </>
          )}
        </div>

        {/* --- Popover de Notificações --- */}
        {showNotificacoes && (
          <div ref={popoverRef} className="absolute left-full top-16 ml-2 w-[340px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col max-h-96 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200">
            {/* Cabeçalho azul, no mesmo padrão do modal de chamado */}
            <div className="bg-[#1e3a8a] px-4 py-3 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Bell size={14} className="text-blue-200 flex-shrink-0" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                  Notificações
                </h3>
                {unreadCount > 0 && (
                  <span className="flex-shrink-0 bg-white/20 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={marcarTodasComoLidas}
                  title="Marcar todas como lidas"
                  className="flex items-center gap-1 text-[10px] text-blue-200 hover:text-white font-bold uppercase tracking-wider transition-colors flex-shrink-0"
                >
                  <CheckCheck size={13} />
                  Marcar todas
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {notificacoes.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center text-center gap-2">
                  <Bell size={22} className="text-slate-300 dark:text-slate-700" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Nenhuma notificação por enquanto.
                  </p>
                </div>
              ) : (
                notificacoes.map((n: any) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={async () => {
                      if (!n.lida) await marcarComoLida(n.id);
                      setShowNotificacoes(false);
                      if (n.ordem_servico_id) {
                        router.push(`/?abrirChamado=${n.ordem_servico_id}`);
                      }
                    }}
                    // Barra azul à esquerda destaca as não lidas.
                    className={`w-full text-left px-4 py-3 transition-colors border-l-[3px] ${!n.lida
                        ? 'border-l-blue-600 bg-blue-50/70 dark:bg-blue-900/10 hover:bg-blue-100/70 dark:hover:bg-blue-900/20'
                        : 'border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${!n.lida ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500 dark:text-slate-500'}`}>
                        {n.titulo}
                      </span>
                      {!n.lida && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium leading-relaxed">
                      {n.mensagem}
                    </p>
                    <span className="text-[9px] text-slate-500 dark:text-slate-500 block mt-1.5 font-medium">
                      {new Date(n.criado_em).toLocaleString('pt-BR')}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===== CAMADA 2 (z-1): Painel Acinzentado da Navegação ===== */}
        <div className="flex-1 flex flex-col rounded-t-2xl rounded-b-2xl bg-white/[0.07] border-t-[3px] border-[#172554] overflow-hidden">
          <nav className={`flex-1 space-y-0.5 ${isCollapsed ? 'px-1.5' : 'px-2'} py-2`}>
            {navItems
              .filter(item => item.roles.includes(cargo) || !cargo)
              .map(item => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={`flex items-center gap-3 rounded-lg transition-all duration-200 group
                      ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'}
                      ${active
                        ? 'bg-white/15 text-white'
                        : 'text-slate-100 hover:text-white hover:bg-white/8'
                      }
                    `}
                  >
                    <Icon size={isCollapsed ? 19 : 17} className="flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-xs font-semibold truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
          </nav>
        </div>
      </div>
    </aside>
    </>
  );
}