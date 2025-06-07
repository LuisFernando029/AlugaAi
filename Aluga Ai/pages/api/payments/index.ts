// /pages/api/payments/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const payments = await prisma.payment.findMany();
    return res.status(200).json(payments);
  }

  if (req.method === "POST") {
    const { orderId, amount, type, method, paymentDate } = req.body;

    if (!orderId || !amount) {
      return res
        .status(400)
        .json({ error: "orderId e amount são obrigatórios." });
    }

    try {
      const payment = await prisma.payment.create({
        data: {
          orderId,
          amount,
          type,
          method,
          paymentDate: paymentDate ? new Date(paymentDate) : undefined,
        },
      });
      return res.status(201).json(payment);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao criar pagamento", details: error });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
