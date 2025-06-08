// pages/api/orders/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(req.query.id as string, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  switch (req.method) {
    case "GET":
      try {
        const order = await prisma.order.findUnique({
          where: { id },
          include: {
            user: true,
            item: {
              include: {
                store: true,
              },
            },
            payments: true,
          },
        });

        if (!order) {
          return res.status(404).json({ error: "Pedido não encontrado" });
        }

        return res.status(200).json(order);
      } catch (error: any) {
        console.error("Erro ao buscar pedido:", error);
        return res.status(500).json({ error: "Erro ao buscar pedido", details: error.message });
      }

    case "PUT":
      try {
        const { userId, itemId, startDate, endDate, totalPrice, status } = req.body;

        const updatedOrder = await prisma.order.update({
          where: { id },
          data: {
            userId,
            itemId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalPrice,
            status,
          },
        });

        return res.status(200).json(updatedOrder);
      } catch (error: any) {
        console.error("Erro ao atualizar pedido:", error);
        return res.status(400).json({ error: "Erro ao atualizar pedido", details: error.message });
      }

    case "DELETE":
      try {
        await prisma.order.delete({ where: { id } });
        return res.status(200).json({ message: "Pedido deletado com sucesso" });
      } catch (error: any) {
        console.error("Erro ao deletar pedido:", error);
        return res.status(400).json({ error: "Erro ao deletar pedido", details: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
