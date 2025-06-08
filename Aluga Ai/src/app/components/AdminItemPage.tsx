"use client";

import { useEffect, useState } from "react";
// Importa o hook useRouter do Next.js para redirecionamento
import { useRouter } from "next/navigation";

type Item = {
	id: number;
	name: string;
	description: string;
	pricePerDay: number;
	securityDeposit: number;
	isAvailable: boolean;
};

export default function AdminPage() {
	const [items, setItems] = useState<Item[]>([]);
	const [storeId, setStoreId] = useState<number | null>(null);
	const [newItem, setNewItem] = useState({
		name: "",
		description: "",
		pricePerDay: 0,
		securityDeposit: 0,
		isAvailable: true,
	});

	const [editingId, setEditingId] = useState<number | null>(null);
	const router = useRouter(); // Inicializa o router

	// useEffect para carregar o storeId do localStorage e verificar a autenticação
	useEffect(() => {
		const loadStoreId = () => {
			try {
				if (typeof window !== "undefined") {
					const storedData = localStorage.getItem("userData"); // Sua chave no localStorage
					if (storedData) {
						const parsed = JSON.parse(storedData);
						// Verifica se existe o objeto 'store' e se ele tem um 'id' numérico
						if (parsed?.store?.id && typeof parsed.store.id === "number") {
							return parsed.store.id;
						}
					}
				}
			} catch (error) {
				console.error("Erro ao ler 'userData' do localStorage:", error);
			}
			return null; // Retorna null se não for um lojista ou houver erro
		};

		const currentStoreId = loadStoreId();

		if (currentStoreId) {
			// Se encontrou um storeId válido, define o estado e busca os itens
			setStoreId(currentStoreId);
			const fetchItems = async (id: number) => {
				try {
					const res = await fetch(`/api/items?storeId=${id}`);
					if (!res.ok) {
						const errorData = await res.json();
						throw new Error(
							`Erro ao buscar os itens: ${res.status} - ${
								errorData.error || res.statusText
							}`
						);
					}
					const data = await res.json();
					setItems(data);
				} catch (err) {
					console.error("Erro ao carregar itens:", err);
				}
			};
			fetchItems(currentStoreId);
		} else {
			// Se storeId não foi encontrado, significa que não é um lojista ou não está logado
			console.warn(
				"Acesso negado: ID da loja não encontrado no localStorage. Redirecionando..."
			);
			// Redireciona para a página inicial ou de login
			router.push("/");
			// Opcional: router.push('/login'); se você tiver uma página de login dedicada para lojistas
		}
	}, [router]); // Adiciona 'router' como dependência para evitar avisos do ESLint

	const handleCreate = async () => {
		if (storeId === null || storeId === undefined) {
			console.error("ID da loja não disponível para criar item.");
			return;
		}
		try {
			const res = await fetch("/api/items", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...newItem, storeId: storeId }),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(
					`Erro ao criar item: ${res.status} - ${
						errorData.error || res.statusText
					}`
				);
			}

			const created = await res.json();
			setItems([...items, created]);
			setNewItem({
				name: "",
				description: "",
				pricePerDay: 0,
				securityDeposit: 0,
				isAvailable: true,
			});
		} catch (err) {
			console.error("Erro ao criar item:", err);
			alert(
				`Falha ao criar item: ${
					err instanceof Error ? err.message : String(err)
				}`
			);
		}
	};

	const handleUpdate = async (id: number) => {
		if (storeId === null || storeId === undefined) {
			console.error("ID da loja não disponível para atualizar item.");
			return;
		}
		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...newItem, storeId: storeId }),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(
					`Erro ao atualizar item: ${res.status} - ${
						errorData.error || res.statusText
					}`
				);
			}

			const updated = await res.json();
			setItems(items.map((item) => (item.id === id ? updated : item)));
			setEditingId(null);
			setNewItem({
				name: "",
				description: "",
				pricePerDay: 0,
				securityDeposit: 0,
				isAvailable: true,
			});
		} catch (err) {
			console.error("Erro ao atualizar item:", err);
			alert(
				`Falha ao atualizar item: ${
					err instanceof Error ? err.message : String(err)
				}`
			);
		}
	};

	const handleDelete = async (id: number) => {
		if (storeId === null || storeId === undefined) {
			console.error("ID da loja não disponível para deletar item.");
			return;
		}
		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ storeId: storeId }),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(
					`Erro ao deletar item: ${res.status} - ${
						errorData.error || res.statusText
					}`
				);
			}

			setItems(items.filter((item) => item.id !== id));
		} catch (err) {
			console.error("Erro ao deletar item:", err);
			alert(
				`Falha ao deletar item: ${
					err instanceof Error ? err.message : String(err)
				}`
			);
		}
	};

	const handleEdit = (item: Item) => {
		setEditingId(item.id);
		setNewItem({ ...item });
	};

	return (
		<div className="bg-[#417FF2] ">
			<div className="p-8 max-w-5xl mx-auto ">
				<h1 className="text-3xl font-bold mb-6 text-white">
					Painel de Administração
				</h1>

				<div className="mb-8 space-y-4 bg-white p-6 rounded shadow">
					<h2 className="text-xl font-semibold text-[#417FF2]">
						{editingId ? "Editar Item" : "Cadastrar Novo Item"}
					</h2>

					<input
						type="text"
						placeholder="Nome"
						value={newItem.name}
						onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
						className="w-full p-2 border rounded text-[#417FF2] focus:border-[#417FF2] focus:ring-[#417FF2] focus:ring-1 outline-none"
					/>

					<textarea
						placeholder="Descrição"
						value={newItem.description}
						onChange={(e) =>
							setNewItem({ ...newItem, description: e.target.value })
						}
						className="w-full p-2 border rounded text-[#417FF2] focus:border-[#417FF2] focus:ring-[#417FF2] focus:ring-1 outline-none"
					/>
					<div className="flex gap-4">
						<label className="text-[#417FF2] mt-2 flex-shrink-0">
							Valor por dia
						</label>
						<input
							type="number"
							placeholder="Preço por dia"
							value={newItem.pricePerDay === 0 ? "" : newItem.pricePerDay}
							onChange={(e) =>
								setNewItem({
									...newItem,
									pricePerDay:
										e.target.value === "" ? 0 : parseFloat(e.target.value),
								})
							}
							className="w-full p-2 border rounded text-[#417FF2] focus:border-[#417FF2] focus:ring-[#417FF2] focus:ring-1 outline-none"
						/>
						<label className="text-[#417FF2] mt-2">Caução</label>
						<input
							type="number"
							placeholder="Caução"
							value={
								newItem.securityDeposit === 0 ? "" : newItem.securityDeposit
							}
							onChange={(e) =>
								setNewItem({
									...newItem,
									securityDeposit:
										e.target.value === "" ? 0 : parseFloat(e.target.value),
								})
							}
							className="w-full p-2 border rounded text-[#417FF2] focus:border-[#417FF2] focus:ring-[#417FF2] focus:ring-1 outline-none"
						/>
					</div>
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={newItem.isAvailable}
							onChange={(e) =>
								setNewItem({ ...newItem, isAvailable: e.target.checked })
							}
						/>
						<label className="text-[#417FF2]">Disponível</label>
					</div>

					<button
						onClick={() =>
							editingId ? handleUpdate(editingId) : handleCreate()
						}
						className="px-4 py-2 bg-[#417FF2] text-white rounded hover:bg-[#355ec9] transition"
						disabled={storeId === null}>
						{editingId ? "Atualizar Item" : "Adicionar Item"}
					</button>
				</div>

				<h2 className="text-xl font-semibold mb-4 text-white">
					Itens Cadastrados
				</h2>
				<div className="space-y-4">
					{items.length === 0 ? (
						<p className="text-x2 font-semibold mb-4 text-white">
							Nenhum item cadastrado.
						</p>
					) : (
						items.map((item) => (
							<div
								key={item.id}
								className="p-4 bg-white shadow rounded border border-gray-200 flex justify-between items-start">
								<div>
									<h3 className="text-lg font-semibold text-[#417FF2]">
										{item.name}
									</h3>
									<p className="text-sm text-gray-600">{item.description}</p>
									<p className="text-sm text-gray-700 mt-1">
										R$ {item.pricePerDay.toFixed(2)} / dia | Caução: R${" "}
										{item.securityDeposit.toFixed(2)} |{" "}
										{item.isAvailable ? "Disponível" : "Indisponível"}
									</p>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => handleEdit(item)}
										className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm">
										Editar
									</button>
									<button
										onClick={() => handleDelete(item.id)}
										className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
										Excluir
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
