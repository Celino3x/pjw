// app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

// GET - Listar usuários
export async function GET(request: Request) {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
        email: true,
        nivel_usuario: true,
        privilegio: true,
        telefone: true,
        foto_perfil: true,
        criado_em: true,
      },
    });

    return NextResponse.json({ success: true, usuarios });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}

// POST - Criar usuário
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Dados recebidos:", body);

    // Validar campos obrigatórios
    if (!body.nome || !body.email || !body.senha) {
      return NextResponse.json(
        { success: false, message: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existe = await prisma.usuario.findUnique({
      where: { email: body.email },
    });

    if (existe) {
      return NextResponse.json(
        { success: false, message: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    // Hash da senha
    const senha_hash = await hash(body.senha, 10);

    // Processar privilégios
    let privilegioStr = "Publicador";
    if (Array.isArray(body.privilegio)) {
      privilegioStr = body.privilegio.join(",");
    } else if (body.privilegio) {
      privilegioStr = body.privilegio;
    }

    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome: body.nome,
        email: body.email,
        senha_hash,
        nivel_usuario: body.nivel_usuario || "Publicador",
        privilegio: privilegioStr,
        data_nascimento: body.data_nascimento ? new Date(body.data_nascimento) : null,
        data_batismo: body.data_batismo ? new Date(body.data_batismo) : null,
        telefone: body.telefone || null,
        endereco: body.endereco || null,
        classe: body.classe || "Outras Ovelhas",
        sexo: body.sexo || null,
        foto_perfil: body.foto_perfil || "/avatar-default.png",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Publicador cadastrado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        nivel_usuario: usuario.nivel_usuario,
      },
    });
  } catch (error) {
    console.error("Erro detalhado ao criar usuário:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erro ao criar publicador: " + (error as Error).message 
      },
      { status: 500 }
    );
  }
}