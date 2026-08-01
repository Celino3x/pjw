// app/api/usuarios/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET - Buscar usuário por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        nivel_usuario: true,
        privilegio: true,
        classe: true,
        sexo: true,
        data_nascimento: true,
        data_batismo: true,
        telefone: true,
        endereco: true,
        foto_perfil: true,
        criado_em: true,
        atualizado_em: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Converter privilégio string para array
    const usuarioComPrivilegios = {
      ...usuario,
      privilegio: usuario.privilegio ? usuario.privilegio.split(",") : ["Publicador"],
    };

    return NextResponse.json({ success: true, usuario: usuarioComPrivilegios });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar usuário
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar se é FormData (com foto) ou JSON
    const contentType = request.headers.get("content-type") || "";

    let body: any = {};
    let fotoPerfil = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      // Extrair campos do FormData
      body.nome = formData.get("nome") as string;
      body.email = formData.get("email") as string;
      body.senha = formData.get("senha") as string;
      body.data_nascimento = formData.get("data_nascimento") as string;
      body.data_batismo = formData.get("data_batismo") as string;
      body.telefone = formData.get("telefone") as string;
      body.endereco = formData.get("endereco") as string;
      body.classe = formData.get("classe") as string;
      body.sexo = formData.get("sexo") as string;
      body.nivel_usuario = formData.get("nivel_usuario") as string;
      body.privilegio = formData.get("privilegio") as string;

      // Processar foto
      const foto = formData.get("foto") as File;
      if (foto && foto.size > 0) {
        const bytes = await foto.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = foto.name.split(".").pop();
        const nomeArquivo = `profile_${Date.now()}.${ext}`;
        const caminho = path.join(process.cwd(), "public/uploads", nomeArquivo);

        await mkdir(path.dirname(caminho), { recursive: true });
        await writeFile(caminho, buffer);
        fotoPerfil = `/uploads/${nomeArquivo}`;
      }
    } else {
      body = await request.json();
      if (body.foto_perfil !== undefined) {
        fotoPerfil = body.foto_perfil;
      }
    }

    // Verificar se usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar email duplicado
    if (body.email && body.email !== usuarioExistente.email) {
      const emailExiste = await prisma.usuario.findUnique({
        where: { email: body.email },
      });
      if (emailExiste) {
        return NextResponse.json(
          { success: false, message: "Este email já está em uso" },
          { status: 400 }
        );
      }
    }

    // Validar privilégios (apenas para homens)
    if (body.sexo === "Feminino") {
      const privilegiosMasculinos = ["Pioneiro", "Servo Ministerial", "Ancião"];
      const privilegiosSelecionados = body.privilegio
        ? body.privilegio.split(",")
        : [];

      for (const priv of privilegiosSelecionados) {
        if (privilegiosMasculinos.includes(priv)) {
          return NextResponse.json(
            {
              success: false,
              message: `O privilégio "${priv}" é permitido apenas para homens`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Dados para atualizar
    const data: any = {
      nome: body.nome,
      email: body.email,
      data_nascimento: body.data_nascimento ? new Date(body.data_nascimento) : null,
      data_batismo: body.data_batismo ? new Date(body.data_batismo) : null,
      telefone: body.telefone || null,
      endereco: body.endereco || null,
      classe: body.classe || "Outras Ovelhas",
      sexo: body.sexo || null,
      nivel_usuario: body.nivel_usuario || "Publicador",
      privilegio: body.privilegio || "Publicador",
    };

    if (fotoPerfil !== undefined) {
      data.foto_perfil = fotoPerfil;
    }

    // Se senha foi fornecida, atualizar
    if (body.senha) {
      if (body.senha.length < 6) {
        return NextResponse.json(
          { success: false, message: "A senha deve ter no mínimo 6 caracteres" },
          { status: 400 }
        );
      }
      data.senha_hash = await hash(body.senha, 10);
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        nivel_usuario: true,
        privilegio: true,
        classe: true,
        sexo: true,
        data_nascimento: true,
        data_batismo: true,
        telefone: true,
        endereco: true,
        foto_perfil: true,
        criado_em: true,
        atualizado_em: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Publicador atualizado com sucesso!",
      usuario,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao atualizar publicador" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir usuário
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    // Verificar se o usuário é o admin principal (não permitir excluir)
    if (id === 1) {
      return NextResponse.json(
        { success: false, message: "Não é possível excluir o administrador principal" },
        { status: 403 }
      );
    }

    await prisma.usuario.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Publicador excluído com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao excluir publicador" },
      { status: 500 }
    );
  }
}