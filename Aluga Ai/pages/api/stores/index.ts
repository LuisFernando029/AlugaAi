// /pages/api/stores/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const stores = await prisma.store.findMany();
    return res.status(200).json(stores);
  }

  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newStore = await prisma.store.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return res.status(201).json(newStore);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar loja", details: error });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
