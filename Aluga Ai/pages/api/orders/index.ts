import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
 if (req.method === "GET") {
  const { userId } = req.query;

  try {
    const orders = await prisma.order.findMany({
      where: userId ? { userId: Number(userId) } : {},
      include: {
        item: {
          include: {
            store: true,
          },
        },
      },
    });

    return res.status(200).json(orders);
  } catch (error: any) {
    console.error("Erro ao buscar pedidos:", error);
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
}

  if (req.method === "POST") {
    const { userId, itemId, startDate, endDate, totalPrice, status } = req.body;

    // Converter para números
    const userIdNumber = Number(userId);
    const itemIdNumber = Number(itemId);
    const totalPriceNumber = Number(totalPrice);

    if (
      !userIdNumber ||
      !itemIdNumber ||
      !startDate ||
      !endDate ||
      totalPriceNumber == null
    ) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    try {
      const order = await prisma.order.create({
        data: {
          userId: userIdNumber,
          itemId: itemIdNumber,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice: totalPriceNumber,
          status: status || "pending",
        },
      });
      return res.status(201).json(order);
    } catch (error: any) {
      console.error("Erro ao criar pedido:", error);
      return res
        .status(500)
        .json({
          error: "Erro ao criar pedido",
          details: error.message || error,
        });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
