// app/admin/page.tsx
import Link from "next/link";
import { Users, UserPlus, CalendarCheck, MapPin, Users as UsersIcon, LayoutDashboard, FileText, HandHeart, Settings, BookOpen, CalendarDays } from "lucide-react";

export default function AdminPage() {
  const modulos = [
    {
      titulo: "Publicadores",
      descricao: "Gerenciar todos os publicadores da congregação",
      icone: Users,
      link: "/admin/usuarios",
      cor: "bg-blue-500",
    },
    {
      titulo: "Designações",
      descricao: "Gerenciar designações das reuniões",
      icone: CalendarCheck,
      link: "/admin/designacoes",
      cor: "bg-green-500",
    },
    {
      titulo: "RVM - Vida e Ministério",
      descricao: "Programação da reunião Vida e Ministério",
      icone: BookOpen,
      link: "/admin/rvm",
      cor: "bg-indigo-500",
    },
    {
      titulo: "Territórios",
      descricao: "Gerenciar territórios da congregação",
      icone: MapPin,
      link: "/admin/territorios",
      cor: "bg-yellow-500",
    },
    {
      titulo: "Grupos de Campo",
      descricao: "Gerenciar grupos e membros",
      icone: UsersIcon,
      link: "/admin/grupos",
      cor: "bg-purple-500",
    },
    {
      titulo: "Saída de Campo",
      descricao: "Designar dirigentes para o campo",
      icone: CalendarDays,
      link: "/admin/saida-campo",
      cor: "bg-orange-500",
    },
    {
      titulo: "Relatórios",
      descricao: "S-21, S-13 e relatórios gerais",
      icone: FileText,
      link: "/admin/relatorios",
      cor: "bg-rose-500",
    },
    {
      titulo: "Donativos",
      descricao: "Gerenciar doações e contribuições",
      icone: HandHeart,
      link: "/admin/donativos",
      cor: "bg-pink-500",
    },
    {
      titulo: "Configurações",
      descricao: "Configurações gerais do sistema",
      icone: Settings,
      link: "/admin/configuracoes",
      cor: "bg-gray-500",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Administração da Congregação
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie todos os aspectos do sistema
        </p>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modulos.map((modulo) => (
          <Link
            key={modulo.titulo}
            href={modulo.link}
            className="group bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-lg ${modulo.cor} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
              <modulo.icone className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {modulo.titulo}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {modulo.descricao}
            </p>
          </Link>
        ))}
      </div>

      {/* Área de Ações Rápidas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Ações Rápidas
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/usuarios/novo"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <UserPlus className="h-4 w-4" />
              Novo Publicador
            </Link>
            <Link
              href="/admin/usuarios"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors text-sm"
            >
              <Users className="h-4 w-4" />
              Ver Publicadores
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-green-600" />
            Estatísticas Rápidas
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" id="totalUsuarios">—</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Publicadores</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" id="totalDesignacoes">—</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Designações</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" id="totalTerritorios">—</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Territórios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Script para carregar estatísticas */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (async function carregarStats() {
              try {
                const [usuariosRes, designacoesRes] = await Promise.all([
                  fetch('/api/usuarios?limit=1'),
                  fetch('/api/designacoes?limit=1')
                ]);
                const usuariosData = await usuariosRes.json();
                const designacoesData = await designacoesRes.json();
                
                document.getElementById('totalUsuarios').textContent = usuariosData.usuarios?.length || 0;
                document.getElementById('totalDesignacoes').textContent = designacoesData.total || 0;
                document.getElementById('totalTerritorios').textContent = '0';
              } catch (e) {
                console.error('Erro ao carregar estatísticas:', e);
              }
            })();
          `,
        }}
      />
    </div>
  );
}