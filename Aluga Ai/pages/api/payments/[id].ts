// /pages/api/payments/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  if (req.method === "GET") {
    try {
      const payment = await prisma.payment.findUnique({ where: { id } });
      if (!payment) return res.status(404).json({ error: "Pagamento não encontrado" });
      return res.status(200).json(payment);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar pagamento", details: error });
    }
  }

  if (req.method === "PUT") {
    const { amount, type, method, paymentDate, orderId } = req.body;

    try {
      const updatedPayment = await prisma.payment.update({
        where: { id },
        data: {
          amount,
          type,
          method,
          paymentDate: paymentDate ? new Date(paymentDate) : undefined,
          orderId
        },
      });
      return res.status(200).json(updatedPayment);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar pagamento", details: error });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.payment.delete({ where: { id } });
      return res.status(200).json({ message: "Pagamento deletado com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar pagamento", details: error });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
