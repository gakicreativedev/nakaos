"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  try {
    const nome = formData.get("nome") as string;
    const cnpj = formData.get("cnpj") as string || "";
    const responsavel = formData.get("responsavel") as string;
    const telefone = formData.get("telefone") as string || "";
    const email = formData.get("email") as string || "";
    const endereco = formData.get("endereco") as string || "";
    const observacoes = formData.get("observacoes") as string || "";
    const valorMensalRaw = formData.get("valorMensal") as string || "0";
    const dataInicio = formData.get("dataInicio") as string || new Date().toISOString().split("T")[0];

    // Serviços (vêm como múltiplos checkboxes com name="servicos" no formulário)
    const servicosForm = formData.getAll("servicos");
    const servicosContratados = servicosForm.length > 0 ? servicosForm.map(String) : [];

    // Redes sociais
    const redesSociais = {
      instagram: formData.get("instagram") as string || undefined,
      facebook: formData.get("facebook") as string || undefined,
      linkedin: formData.get("linkedin") as string || undefined,
      tiktok: formData.get("tiktok") as string || undefined,
    };

    const valorMensal = parseFloat(valorMensalRaw.replace("R$", "").replace(/\./g, "").replace(",", ".")) || 0;
    
    // Gerar IDs e datas automáticas
    const id = crypto.randomUUID();
    const criadoEm = new Date().toISOString().split("T")[0];
    
    // Calcular data fictícia de renovação (1 ano a partir de hoje se não tiver lógica melhor)
    let startDate = new Date(dataInicio);
    if (isNaN(startDate.getTime())) {
      startDate = new Date();
    }
    startDate.setFullYear(startDate.getFullYear() + 1);
    const dataRenovacao = startDate.toISOString().split("T")[0];

    await db.insert(schema.clients).values({
      id,
      nome,
      cnpj,
      responsavel,
      telefone,
      email,
      endereco,
      redesSociais,
      status: "Onboarding", // Todo novo cliente entra em Onboarding
      servicosContratados,
      valorMensal,
      dataInicio,
      dataRenovacao,
      observacoes,
      criadoEm
    });

    revalidatePath("/clientes");
    return { success: true };
  } catch (error) {
    console.error("[createClient] Error DB:", error);
    return { error: "Falha ao salvar o cliente no banco de dados." };
  }
}
