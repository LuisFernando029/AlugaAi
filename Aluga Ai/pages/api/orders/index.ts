// /pages/api/orders/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const orders = await prisma.order.findMany();
    return res.status(200).json(orders);
  }

  if (req.method === "POST") {
    const { userId, itemId, startDate, endDate, totalPrice, status } = req.body;

    if (!userId || !itemId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    try {
      const order = await prisma.order.create({
        data: {
          userId,
          itemId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice,
          status: status || "pending",
        },
      });
      return res.status(201).json(order);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar pedido", details: error });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
