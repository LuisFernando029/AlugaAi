import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (req.method === "GET") {
    // Buscar item por id
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: "Item não encontrado" });
    return res.status(200).json(item);
  }
 else if (req.method === "PUT") {
  const data = req.body;

  // Monta o objeto updateData só com campos definidos
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.pricePerDay !== undefined) updateData.pricePerDay = data.pricePerDay;
  if (data.securityDeposit !== undefined) updateData.securityDeposit = data.securityDeposit;
  if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;
  if (data.metadata !== undefined) updateData.metadata = data.metadata;

  try {
    const updatedItem = await prisma.item.update({
      where: { id },
      data: updateData,
    });
    return res.status(200).json(updatedItem);
  } catch (error) {
    return res.status(400).json({ error: "Erro ao atualizar item", details: error });
  }
}

  else if (req.method === "DELETE") {
    // Deletar item
    try {
      await prisma.item.delete({ where: { id } });
      return res.status(200).json({ message: "Item deletado com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar item", details: error });
    }
  }
  else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
