// /pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  try {
    // Primeiro tenta autenticar como usuário
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
      return res.status(200).json({ message: "Login bem-sucedido!", user, role: "user" });
    }

    // Se falhar como usuário, tenta autenticar como loja
    const store = await prisma.store.findUnique({ where: { email } });

    if (store && await bcrypt.compare(password, store.password)) {
      return res.status(200).json({ message: "Login bem-sucedido!", store, role: "store" });
    }

    // Se não for nem usuário nem loja
    return res.status(401).json({ error: "Credenciais inválidas." });
    
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
