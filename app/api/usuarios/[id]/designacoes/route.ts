// app/api/usuarios/[id]/designacoes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar designações do usuário
export async function GET(
  request: NextRequest,
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

    const { searchParams } = new URL(request.url);
    const data = searchParams.get("data");

    const where: any = {
      OR: [
        { leitor_id: id },
        { indicador1_id: id },
        { indicador2_id: id },
        { volante1_id: id },
        { volante2_id: id },
        { pedestal_id: id },
        { audio_video_id: id },
        { seguranca_id: id },
        { presidente_id: id },
      ],
    };

    if (data) {
      where.data_reuniao = new Date(data);
    }

    const designacoes = await prisma.designacaoReuniao.findMany({
      where,
      orderBy: { data_reuniao: "desc" },
      include: {
        leitor: { select: { nome: true } },
        presidente: { select: { nome: true } },
      },
    });

    // Mapear para mostrar o cargo
    const designacoesFormatadas = designacoes.map((d) => {
      let cargo = "";
      if (d.leitor_id === id) cargo = "Leitor";
      else if (d.indicador1_id === id) cargo = "Indicador 1";
      else if (d.indicador2_id === id) cargo = "Indicador 2";
      else if (d.volante1_id === id) cargo = "Volante 1";
      else if (d.volante2_id === id) cargo = "Volante 2";
      else if (d.pedestal_id === id) cargo = "Pedestal";
      else if (d.audio_video_id === id) cargo = "Áudio/Vídeo";
      else if (d.seguranca_id === id) cargo = "Segurança";
      else if (d.presidente_id === id) cargo = "Presidente";

      return {
        ...d,
        cargo,
      };
    });

    return NextResponse.json({
      success: true,
      designacoes: designacoesFormatadas,
      total: designacoesFormatadas.length,
    });
  } catch (error) {
    console.error("Erro ao buscar designações:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar designações" },
      { status: 500 }
    );
  }
}