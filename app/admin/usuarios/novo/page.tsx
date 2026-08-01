// app/admin/usuarios/novo/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Estado do formulário
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmar_senha: "",
    data_nascimento: "",
    data_batismo: "",
    telefone: "",
    endereco: "",
    classe: "Outras Ovelhas",
    sexo: "",
    nivel_usuario: "Publicador",
    privilegio: ["Publicador"] as string[],
  });

  // Opções de privilégios
  const privilegiosDisponiveis = [
    "Publicador",
    "Pioneiro Regular",
    "Pioneiro Auxiliar",
    "Pioneiro Especial",
    "Servo Ministerial",
    "Ancião",
  ];

  // Opções de nível de acesso
  const niveisAcesso = [
    { value: "Publicador", label: "Publicador" },
    { value: "Consulta", label: "Consulta" },
    { value: "Administrador", label: "Administrador" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso("");

    // Validar senha
    if (form.senha !== form.confirmar_senha) {
      setErro("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (form.senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setSucesso("Publicador cadastrado com sucesso!");
        setTimeout(() => {
          router.push("/admin/usuarios");
        }, 1500);
      } else {
        setErro(data.message || "Erro ao cadastrar publicador");
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Novo Publicador
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

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              value={form.sexo}
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
              value={form.data_nascimento}
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
              value={form.data_batismo}
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
              value={form.telefone}
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
              value={form.endereco}
              onChange={handleChange}
              placeholder="Rua, número, bairro, cidade"
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Senha *
            </label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="mt-1 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar Senha *
            </label>
            <input
              type="password"
              name="confirmar_senha"
              value={form.confirmar_senha}
              onChange={handleChange}
              required
              placeholder="Digite a senha novamente"
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar Publicador"}
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