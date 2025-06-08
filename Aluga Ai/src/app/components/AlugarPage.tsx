"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Item } from "@prisma/client";

export default function AlugarPage() {
    const params = useParams();
    const id = params?.id;

    const router = useRouter();
    const [item, setItem] = useState<Item | null>(null);
    const [startDate, setStartDate] = useState("");
    const [durationDays, setDurationDays] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || Array.isArray(id)) {
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`/api/items/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Item não encontrado.");
                }
                return res.json();
            })
            .then((data) => {
                setItem(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar item:", err);
                setError("Não foi possível carregar os detalhes do item.");
                setLoading(false);
            });
    }, [id]);

    const totalPrice = useMemo(() => {
        if (item && durationDays > 0) {
            return item.pricePerDay * durationDays;
        }
        return 0;
    }, [item, durationDays]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!startDate || durationDays < 1) {
            return setError("Por favor, preencha a data de início e a duração em dias.");
        }

        if (!item) {
            return setError("Item não carregado. Tente recarregar a página.");
        }

        try {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const userId = Number(userData?.user?.id);
            if (!userId) {
                router.push('/login');
                return setError("Usuário não autenticado. Redirecionando para o login.");
            }

            const itemId = Number(id);
            if (!itemId) {
                return setError("ID do item inválido.");
            }

            const start = new Date(startDate + 'T00:00:00');
            const end = new Date(start);
            end.setDate(start.getDate() + durationDays);

            const finalTotalPrice = item.pricePerDay * durationDays;

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    itemId,
                    startDate: start.toISOString(),
                    endDate: end.toISOString(),
                    totalPrice: finalTotalPrice,
                    status: "pending",
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                return setError(data.error || "Ocorreu um erro ao criar o pedido. Tente novamente.");
            }

            router.push("/meus-pedidos");
        } catch (err) {
            console.error("Erro ao processar pedido:", err);
            setError("Erro interno do servidor. Por favor, tente novamente mais tarde.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
                <p className="text-white text-2xl font-light tracking-wide animate-pulse">Carregando detalhes do item...</p>
            </div>
        );
    }

    if (error && !item) {
        return (
            <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
                <p className="text-red-300 text-2xl font-light text-center px-4">{error}</p>
            </div>
        );
    }

    if (!id || Array.isArray(id) || !item) {
        return (
            <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
                <p className="text-red-300 text-2xl font-light text-center px-4">
                    ID do item inválido ou item não encontrado.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#417FF2] py-20 px-4 flex flex-col items-center justify-center font-sans">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl space-y-10 animate-fade-in">
                {/* Título Principal */}
                <h2 className="text-4xl font-light text-[#417FF2] text-center tracking-tight leading-tight">
                    Confirmar <br /><span className="font-semibold">{item.name}</span>
                </h2>

                {/* Detalhes do Item - Seção de destaque com borda sutil */}
                <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-inner flex flex-col items-center">
                    <p className="text-lg text-gray-700 mb-2">{item.description}</p>
                    <p className="text-xl font-medium text-gray-800">
                        Preço por dia: <span className="text-[#417FF2] font-bold">R$ {item.pricePerDay.toFixed(2)}</span>
                    </p>
                    <p className="text-md text-gray-600 mt-1">
                        Caução: <span className="font-semibold">R$ {item.securityDeposit.toFixed(2)}</span>
                    </p>
                </div>

                {/* Campos do Formulário */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="startDate" className="block text-[#417FF2] text-lg font-medium mb-3">
                            Data de Início do Aluguel
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-4 border-b-2 border-b-[#417FF2] rounded-t-lg bg-gray-50 text-gray-800 text-lg focus:outline-none focus:bg-white focus:shadow-md transition-all duration-300 ease-in-out appearance-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="durationDays" className="block text-[#417FF2] text-lg font-medium mb-3">
                            Duração (em dias)
                        </label>
                        <input
                            id="durationDays"
                            type="number"
                            value={durationDays}
                            onChange={(e) => setDurationDays(Number(e.target.value))}
                            min={1}
                            className="w-full p-4 border-b-2 border-b-[#417FF2] rounded-t-lg bg-gray-50 text-gray-800 text-lg focus:outline-none focus:bg-white focus:shadow-md transition-all duration-300 ease-in-out"
                            required
                        />
                    </div>

                    {/* Total a Pagar - Destacado com uma cor de fundo sutil */}
                    {durationDays > 0 && item && (
                        <div className="bg-[#f0f8ff] p-8 rounded-xl border border-[#d0e0f7] text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <p className="text-2xl text-[#417FF2] font-light mb-2">
                                Valor Total Estimado
                            </p>
                            <p className="text-6xl font-extrabold text-[#417FF2] tracking-tighter">
                                R$ {totalPrice.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                                * Este valor inclui apenas o custo diário do item pelo período selecionado. <br />A caução é um valor à parte, pago no momento da retirada.
                            </p>
                        </div>
                    )}

                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center text-base font-normal animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Botão de Confirmação */}
                    <button
                        type="submit"
                        className="w-full bg-[#417FF2] text-white py-5 rounded-xl hover:bg-[#355ec9] transition-all duration-300 font-bold text-xl tracking-wide uppercase shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#417FF2]/60 focus:ring-offset-2 focus:ring-offset-white"
                    >
                        Confirmar Aluguel
                    </button>
                </form>
            </div>
        </div>
    );
}