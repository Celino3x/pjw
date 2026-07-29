// app/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();

  // Função para logout (simples)
  const handleLogout = () => {
    router.push("/login");
  };

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
              Administrador
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
      <main className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bem-vindo, Administrador! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Painel de controle da congregação
        </p>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Publicadores</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Designações</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Territórios</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Grupos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
          </div>
        </div>
      </main>
    </div>
  );
}