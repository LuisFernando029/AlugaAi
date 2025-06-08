// pages/api/items/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const { storeId } = req.query; // Obtém o storeId da query string

        try {
            if (storeId) {
                // Se storeId estiver presente na query, filtra por ele
                const items = await prisma.item.findMany({
                    where: {
                        storeId: Number(storeId), // Converte para número
                    },
                    include: { store: true },
                });
                return res.status(200).json(items);
            } else {
                // Se storeId NÃO estiver presente, retorna todos os itens (para o cliente)
                const items = await prisma.item.findMany({ include: { store: true } });
                return res.status(200).json(items);
            }
        } catch (error) {
            console.error("Erro ao buscar itens:", error);
            return res.status(500).json({ error: "Erro interno do servidor ao buscar itens." });
        }
    } else if (req.method === "POST") {
        // ... (seu código POST existente, que já está bom)
        const data = req.body;

        if (!data.storeId) {
            return res.status(400).json({ error: "storeId é obrigatório para criar um item." });
        }

        try {
            const newItem = await prisma.item.create({
                data: {
                    storeId: data.storeId,
                    name: data.name,
                    description: data.description,
                    pricePerDay: data.pricePerDay,
                    securityDeposit: data.securityDeposit ?? 0,
                    isAvailable: data.isAvailable ?? true,
                    metadata: data.metadata,
                },
            });
            return res.status(201).json(newItem);
        } catch (error) {
            console.error("Erro ao criar item:", error);
            return res
                .status(400)
                .json({ error: "Erro ao criar item", details: error });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}