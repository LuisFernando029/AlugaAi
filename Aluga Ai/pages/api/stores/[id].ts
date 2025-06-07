import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (req.method === "GET") {
    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) return res.status(404).json({ error: "Loja não encontrada" });
    return res.status(200).json(store);
  }

  if (req.method === "PUT") {
    const { name, email, password } = req.body;

    try {
      const updatedStore = await prisma.store.update({
        where: { id },
        data: { name, email, password },
      });

      return res.status(200).json(updatedStore);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar loja", details: error });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.store.delete({ where: { id } });
      return res.status(200).json({ message: "Loja deletada com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar loja", details: error });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
