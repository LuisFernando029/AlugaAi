import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		// Listar todos os itens
		const items = await prisma.item.findMany({ include: { store: true } });
		return res.status(200).json(items);
		console.log("Itens: ", items);
	} else if (req.method === "POST") {
		// Criar um novo item
		const data = req.body;

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
			return res
				.status(400)
				.json({ error: "Erro ao criar item", details: error });
		}
	} else {
		res.setHeader("Allow", ["GET", "POST"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
