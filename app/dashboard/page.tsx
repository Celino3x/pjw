// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, CalendarCheck, MapPin, Church } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  nivel_usuario: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    usuarios: 0,
    designacoes: 0,
    territorios: 0,
    grupos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Administrador");

  useEffect(() => {
    const carregarStats = async () => {
      try {
        // Buscar usuários
        const usuariosRes = await fetch("/api/usuarios");
        const usuariosData = await usuariosRes.json();

        // Buscar designações (se existir a API)
        let designacoesCount = 0;
        try {
          const designacoesRes = await fetch("/api/designacoes?limit=1");
          const designacoesData = await designacoesRes.json();
          designacoesCount = designacoesData.total || 0;
        } catch (e) {
          // Se não existir, mantém 0
        }

        setStats({
          usuarios: usuariosData.usuarios?.length || 0,
          designacoes: designacoesCount,
          territorios: 0,
          grupos: 0,
        });

        // Pegar nome do usuário
        const userRes = await fetch("/api/auth/session");
        const session = await userRes.json();
        if (session?.user?.name) {
          setUserName(session.user.name);
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarStats();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const cards = [
    {
      titulo: "Publicadores",
      valor: stats.usuarios,
      icone: Users,
      cor: "bg-blue-500",
    },
    {
      titulo: "Designações",
      valor: stats.designacoes,
      icone: CalendarCheck,
      cor: "bg-green-500",
    },
    {
      titulo: "Territórios",
      valor: stats.territorios,
      icone: MapPin,
      cor: "bg-yellow-500",
    },
    {
      titulo: "Grupos",
      valor: stats.grupos,
      icone: Church,
      cor: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">JW</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Portal JW
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {userName}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bem-vindo, {userName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Painel de controle da congregação
        </p>

        {loading ? (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {card.titulo}
                    </p>
                    <div className={`p-2 rounded-lg ${card.cor}`}>
                      <card.icone className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
                    {card.valor}
                  </p>
                </div>
              ))}
            </div>

            {/* Ações rápidas */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  📋 Ações Rápidas
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/admin/usuarios/novo"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    + Novo Publicador
                  </a>
                  <a
  href="/admin/usuarios"
  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
>
  Ver Publicadores
</a>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  📊 Atalhos
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/admin"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Administração
                  </a>
                  <a
                    href="/admin/designacoes"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Designações
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}