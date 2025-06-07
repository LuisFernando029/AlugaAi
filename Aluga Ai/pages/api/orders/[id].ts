// /pages/api/orders/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (req.method === "GET") {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          user: true,
          item: true,
          payments: true,
        },
      });
      if (!order) return res.status(404).json({ error: "Pedido não encontrado" });
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar pedido", details: error });
    }
  }

  else if (req.method === "PUT") {
    const data = req.body;

    try {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          userId: data.userId,
          itemId: data.itemId,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          totalPrice: data.totalPrice,
          status: data.status,
        },
      });
      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar pedido", details: error });
    }
  }

  else if (req.method === "DELETE") {
    try {
      await prisma.order.delete({ where: { id } });
      return res.status(200).json({ message: "Pedido deletado com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar pedido", details: error });
    }
  }

  else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
