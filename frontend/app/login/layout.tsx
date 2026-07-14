// Layout das telas de autenticação (login, cadastro, recuperar/redefinir senha):
// ocupa a tela inteira, sem sidebar. O fundo e o card ficam a cargo do AuthCard,
// que respeita o tema claro/escuro (o layout antigo forçava um cinza escuro fixo).
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 overflow-y-auto">{children}</div>;
}
