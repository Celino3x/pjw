"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Camera, User, X, Loader2 } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  data_nascimento: string | null;
  data_batismo: string | null;
  telefone: string | null;
  endereco: string | null;
  classe: string;
  sexo: string | null;
  nivel_usuario: string;
  privilegio: string[];
  foto_perfil: string | null;
}

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);

  const [form, setForm] = useState<Usuario>({
    id: 0,
    nome: "",
    email: "",
    data_nascimento: null,
    data_batismo: null,
    telefone: null,
    endereco: null,
    classe: "Outras Ovelhas",
    sexo: null,
    nivel_usuario: "Publicador",
    privilegio: ["Publicador"],
    foto_perfil: null,
  });

  const privilegiosDisponiveis = [
    "Publicador",
    "Pioneiro Regular",
    "Pioneiro Auxiliar",
    "Pioneiro Especial",
    "Servo Ministerial",
    "Ancião",
  ];

  const niveisAcesso = [
    { value: "Publicador", label: "Publicador" },
    { value: "Consulta", label: "Consulta" },
    { value: "Administrador", label: "Administrador" },
  ];

  // Carregar dados do usuário
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const response = await fetch(`/api/usuarios/${id}`);
        const data = await response.json();

        if (data.success) {
          const usuario = data.usuario;
          setForm({
            ...usuario,
            data_nascimento: usuario.data_nascimento || null,
            data_batismo: usuario.data_batismo || null,
            privilegio: Array.isArray(usuario.privilegio)
              ? usuario.privilegio
              : usuario.privilegio?.split(",") || ["Publicador"],
          });
          if (usuario.foto_perfil) {
            setFotoPreview(usuario.foto_perfil);
          }
        } else {
          setErro(data.message || "Usuário não encontrado");
        }
      } catch (error) {
        setErro("Erro ao carregar dados do usuário");
      } finally {
        setCarregandoDados(false);
      }
    };

    if (id) {
      carregarUsuario();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrivilegioChange = (privilegio: string) => {
    setForm((prev) => {
      const current = prev.privilegio;
      if (current.includes(privilegio)) {
        return { ...prev, privilegio: current.filter((p) => p !== privilegio) };
      } else {
        return { ...prev, privilegio: [...current, privilegio] };
      }
    });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErro("Por favor, selecione uma imagem válida.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErro("A imagem deve ter no máximo 5MB.");
        return;
      }

      setFotoArquivo(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setErro("");
    }
  };

  const removerFoto = () => {
    setFotoPreview(null);
    setFotoArquivo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso("");

    try {
      // Criar FormData para enviar com arquivo
      const formData = new FormData();

      // Adicionar todos os campos do form
      Object.entries(form).forEach(([key, value]) => {
        if (key === "privilegio") {
          formData.append(key, value.join(","));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Adicionar ID
      formData.append("id", id);

      // Adicionar foto se houver nova
      if (fotoArquivo) {
        formData.append("foto", fotoArquivo);
      }

      const response = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSucesso("Publicador atualizado com sucesso!");
        setTimeout(() => {
          router.push("/admin/usuarios");
        }, 1500);
      } else {
        setErro(data.message || "Erro ao atualizar publicador");
      }
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  if (carregandoDados) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Editar Publicador
        </h1>
        <Link
          href="/admin/usuarios"
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          ← Voltar para lista
        </Link>
      </div>

      {erro && (
        <div className="p-3 mb-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="p-3 mb-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
          {sucesso}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Foto */}
          <div className="col-span-2 flex items-center gap-4">
            <div className="relative">
              {fotoPreview ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removerFoto}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                  <User className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                <Camera className="h-4 w-4" />
                {fotoPreview ? "Trocar foto" : "Adicionar foto"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                JPG, PNG ou GIF. Máx. 5MB
              </p>
            </div>
          </div>

          {/* Nome */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sexo
            </label>
            <select
              name="sexo"
              value={form.sexo || ""}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Apenas homens podem ser: Ancião, Servo Ministerial ou Pioneiro
            </p>
          </div>

          {/* Data Nascimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Nascimento
            </label>
            <input
              type="date"
              name="data_nascimento"
              value={form.data_nascimento || ""}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Data Batismo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Batismo
            </label>
            <input
              type="date"
              name="data_batismo"
              value={form.data_batismo || ""}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Telefone (WhatsApp)
            </label>
            <input
              type="text"
              name="telefone"
              value={form.telefone || ""}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Classe
            </label>
            <select
              name="classe"
              value={form.classe}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Outras Ovelhas">Outras Ovelhas</option>
              <option value="Ungido">Ungido</option>
            </select>
          </div>

          {/* Endereço */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Endereço
            </label>
            <input
              type="text"
              name="endereco"
              value={form.endereco || ""}
              onChange={handleChange}
              placeholder="Rua, número, bairro, cidade"
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Nível de Acesso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nível de Acesso
            </label>
            <select
              name="nivel_usuario"
              value={form.nivel_usuario}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {niveisAcesso.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Apenas Administradores podem alterar este campo
            </p>
          </div>

          {/* Privilégios */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Privilégios
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {privilegiosDisponiveis.map((priv) => (
                <label
                  key={priv}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    form.privilegio.includes(priv)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.privilegio.includes(priv)}
                    onChange={() => handlePrivilegioChange(priv)}
                    className="hidden"
                  />
                  {priv}
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Todos são publicadores por padrão. Ancião, Servo Ministerial e Pioneiro são apenas para homens.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
          <Link
            href="/admin/usuarios"
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}