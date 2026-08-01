// app/admin/usuarios/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit, Trash2, Eye, User, Pencil, Trash } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  nivel_usuario: string;
  privilegio: string;
  telefone: string | null;
  foto_perfil: string | null;
  criado_em: string;
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");
  const [filtroPrivilegio, setFiltroPrivilegio] = useState("");

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (busca) params.append("busca", busca);
      if (filtroNivel) params.append("nivel", filtroNivel);
      if (filtroPrivilegio) params.append("privilegio", filtroPrivilegio);

      const response = await fetch(`/api/usuarios?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setUsuarios(data.usuarios);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, [busca, filtroNivel, filtroPrivilegio]);

  const excluirUsuario = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o publicador "${nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        carregarUsuarios();
      } else {
        alert(data.message || "Erro ao excluir");
      }
    } catch (error) {
      alert("Erro ao excluir publicador");
    }
  };

  const formatarPrivilegios = (privilegio: string) => {
    return privilegio.split(",").join(", ");
  };

  const getNivelBadge = (nivel: string) => {
    const cores: Record<string, string> = {
      Administrador: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Publicador: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      Consulta: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    };
    return cores[nivel] || "bg-gray-100 text-gray-800";
  };

  const getAvatar = (usuario: Usuario) => {
    if (usuario.foto_perfil) {
      return usuario.foto_perfil;
    }
    // Avatar padrão com a primeira letra do nome
    return null;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Publicadores
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gerencie todos os publicadores da congregação
          </p>
        </div>
        <Link
          href="/admin/usuarios/novo"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Publicador
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <select
          value={filtroNivel}
          onChange={(e) => setFiltroNivel(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos os níveis</option>
          <option value="Administrador">Administrador</option>
          <option value="Publicador">Publicador</option>
          <option value="Consulta">Consulta</option>
        </select>

        <select
          value={filtroPrivilegio}
          onChange={(e) => setFiltroPrivilegio(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos os privilégios</option>
          <option value="Ancião">Ancião</option>
          <option value="Servo Ministerial">Servo Ministerial</option>
          <option value="Pioneiro Regular">Pioneiro Regular</option>
          <option value="Pioneiro Auxiliar">Pioneiro Auxiliar</option>
          <option value="Pioneiro Especial">Pioneiro Especial</option>
        </select>

        <button
          onClick={() => {
            setBusca("");
            setFiltroNivel("");
            setFiltroPrivilegio("");
          }}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          Limpar filtros
        </button>
      </div>

      {/* Lista de Usuários */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <User className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Nenhum publicador encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {busca || filtroNivel || filtroPrivilegio
              ? "Tente ajustar os filtros de busca"
              : "Comece cadastrando o primeiro publicador"}
          </p>
          {!busca && !filtroNivel && !filtroPrivilegio && (
            <Link
              href="/admin/usuarios/novo"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Cadastrar Publicador
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Publicador
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nível
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Privilégios
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {usuarios.map((usuario) => {
                  const avatar = getAvatar(usuario);
                  return (
                    <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={usuario.nome}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                              {usuario.nome.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {usuario.nome}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {usuario.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNivelBadge(usuario.nivel_usuario)}`}>
                          {usuario.nivel_usuario}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {formatarPrivilegios(usuario.privilegio)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {usuario.telefone || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/usuarios/${usuario.id}`}
                            className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/usuarios/${usuario.id}/editar`}
                            className="p-1.5 text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          {usuario.id !== 1 && (
                            <button
                              onClick={() => excluirUsuario(usuario.id, usuario.nome)}
                              className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                              title="Excluir"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            Total: {usuarios.length} publicador(es)
          </div>
        </div>
      )}
    </div>
  );
}