// /pages/api/users/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "Nome, e-mail, telefone e senha são obrigatórios." });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
        },
      });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar usuário", details: error });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
