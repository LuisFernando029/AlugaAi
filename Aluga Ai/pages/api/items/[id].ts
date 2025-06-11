import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const id = Number(req.query.id);

	if (isNaN(id)) {
		return res.status(400).json({ error: "ID inválido" });
	}

	if (req.method === "GET") {
		try {
			const item = await prisma.item.findUnique({ where: { id } });
			if (!item) return res.status(404).json({ error: "Item não encontrado" });
			return res.status(200).json(item);
		} catch (error) {
			return res.status(500).json({ error: "Erro ao buscar item" });
		}
	}

	if (req.method === "PUT") {
		try {
			const data = req.body;

			const updateData: any = {};
			if (data.name !== undefined) updateData.name = data.name;
			if (data.description !== undefined)
				updateData.description = data.description;
			if (data.pricePerDay !== undefined)
				updateData.pricePerDay = data.pricePerDay;
			if (data.securityDeposit !== undefined)
				updateData.securityDeposit = data.securityDeposit;
			if (data.isAvailable !== undefined)
				updateData.isAvailable = data.isAvailable;
			if (data.metadata !== undefined) updateData.metadata = data.metadata;

			const updatedItem = await prisma.item.update({
				where: { id },
				data: updateData,
			});

			return res.status(200).json(updatedItem);
		} catch (error) {
			return res
				.status(400)
				.json({ error: "Erro ao atualizar item", details: error });
		}
	}
	if (req.method === "DELETE") {
		try {
			await prisma.item.delete({ where: { id } });
			return res.status(200).json({ message: "Item deletado com sucesso" });
		} catch (error: any) {
			if (error.code === "P2003") {
				try {
					const updatedItem = await prisma.item.update({
						where: { id },
						data: { isAvailable: false },
					});
					return res.status(200).json({
						message:
							"Item não pôde ser deletado, mas foi marcado como indisponível",
						item: updatedItem,
					});
				} catch (updateError: any) {
					console.error("Erro ao marcar item como indisponível:", updateError);
					return res.status(400).json({
						error: "Erro ao marcar item como indisponível",
						details: updateError.message,
					});
				}
			}

			console.error("Erro ao deletar item:", error);
			return res.status(400).json({
				error: "Erro ao deletar item",
				details: error.message,
			});
		}
	}

	res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
	return res.status(405).end(`Method ${req.method} Not Allowed`);
}
