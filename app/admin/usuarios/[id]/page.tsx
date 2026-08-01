// app/admin/usuarios/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Phone, Mail, MapPin, User, Shield, Award } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  nivel_usuario: string;
  privilegio: string[];
  classe: string;
  sexo: string;
  data_nascimento: string | null;
  data_batismo: string | null;
  telefone: string | null;
  endereco: string | null;
  foto_perfil: string | null;
  criado_em: string;
  atualizado_em: string;
}

export default function UsuarioDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const response = await fetch(`/api/usuarios/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setUsuario(data.usuario);
        } else {
          setErro(data.message || "Usuário não encontrado");
        }
      } catch (error) {
        setErro("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, [params.id]);

  const formatarData = (data: string | null) => {
    if (!data) return "—";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarDataHora = (data: string) => {
    return new Date(data).toLocaleString("pt-BR");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (erro || !usuario) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {erro || "Usuário não encontrado"}
        </div>
        <Link
          href="/admin/usuarios"
          className="inline-block mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          ← Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/usuarios"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {usuario.nome}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          usuario.nivel_usuario === "Administrador"
            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            : usuario.nivel_usuario === "Consulta"
            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        }`}>
          {usuario.nivel_usuario}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Principal */}
        <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl font-medium text-blue-600 dark:text-blue-400">
              {usuario.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{usuario.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {usuario.privilegio.map((priv) => (
                  <span
                    key={priv}
                    className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium"
                  >
                    {priv}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Nascimento</p>
                <p className="font-medium">{formatarData(usuario.data_nascimento)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Batismo</p>
                <p className="font-medium">{formatarData(usuario.data_batismo)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Telefone</p>
                <p className="font-medium">{usuario.telefone || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Sexo</p>
                <p className="font-medium">{usuario.sexo || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Award className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Classe</p>
                <p className="font-medium">{usuario.classe}</p>
              </div>
            </div>
          </div>

          {usuario.endereco && (
            <div className="mt-4 flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Endereço</p>
                <p className="font-medium">{usuario.endereco}</p>
              </div>
            </div>
          )}
        </div>

        {/* Card de Informações adicionais */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Informações</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Cadastrado em</p>
              <p className="font-medium">{formatarDataHora(usuario.criado_em)}</p>
            </div>
            {usuario.atualizado_em && usuario.atualizado_em !== usuario.criado_em && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Última atualização</p>
                <p className="font-medium">{formatarDataHora(usuario.atualizado_em)}</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Link
              href={`/admin/usuarios/${usuario.id}/editar`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Editar Publicador
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}