"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Item } from "@prisma/client"; // Certifique-se de que este import está correto para o seu Prisma Client

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
                router.push('/login'); // Redireciona para login se não autenticado
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
                <p className="text-white text-2xl font-semibold animate-pulse">Carregando detalhes do item...</p>
            </div>
        );
    }

    if (error && !item) {
        return (
            <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
                <p className="text-red-300 text-2xl font-semibold text-center px-4">{error}</p>
            </div>
        );
    }

    if (!id || Array.isArray(id) || !item) {
        return (
            <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
                <p className="text-red-300 text-2xl font-semibold text-center px-4">
                    ID do item inválido ou item não encontrado.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#417FF2] py-16 px-4 flex flex-col items-center justify-center font-sans">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-xl space-y-8 animate-fade-in-up">
                {/* Título Principal */}
                <h2 className="text-4xl font-extrabold text-[#417FF2] text-center mb-8 tracking-tight">
                    Alugar <span className="block mt-1">{item.name}</span>
                </h2>

                {/* Detalhes do Item - Em destaque */}
                <div className="bg-gradient-to-br from-[#417FF2] to-[#355ec9] p-6 rounded-xl text-white shadow-lg text-center">
                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-100 text-sm mb-4">{item.description}</p>
                    <p className="text-xl font-bold">
                        Valor por dia: <span className="text-green-500 text-border-1">R$ {item.pricePerDay.toFixed(2)}</span>
                    </p>
                    <p className="text-md mt-1">
                        Caução: <span className="font-semibold">R$ {item.securityDeposit.toFixed(2)}</span>
                    </p>
                </div>

                {/* Campos do Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="startDate" className="block text-[#417FF2] text-lg font-semibold mb-2">
                            Quando você quer começar?
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-3 border-2 border-[#417FF2] rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#417FF2]/30 transition-all duration-300 ease-in-out"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="durationDays" className="block text-[#417FF2] text-lg font-semibold mb-2">
                            Por quantos dias?
                        </label>
                        <input
                            id="durationDays"
                            type="number"
                            value={durationDays}
                            onChange={(e) => setDurationDays(Number(e.target.value))}
                            min={1}
                            className="w-full p-3 border-2 border-[#417FF2] rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-[#417FF2]/30 transition-all duration-300 ease-in-out"
                            required
                        />
                    </div>

                    {/* Total a Pagar - Destaque em Azul */}
                    {durationDays > 0 && item && (
                        <div className="bg-[#eaf1fb] p-6 rounded-xl border border-[#c1d1ee] text-center shadow-inner">
                            <p className="text-xl text-[#417FF2] font-semibold mb-2">
                                Total Estimado do Aluguel:
                            </p>
                            <p className="text-5xl font-extrabold text-[#417FF2] tracking-tight">
                                R$ {totalPrice.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600 mt-3">
                                * Este valor refere-se apenas ao período de aluguel. A caução é um valor à parte.
                            </p>
                        </div>
                    )}

                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center text-sm font-medium animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Botão de Confirmação */}
                    <button
                        type="submit"
                        className="w-full bg-[#417FF2] text-white py-4 rounded-xl hover:bg-[#355ec9] transition-all duration-300 font-bold text-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#417FF2]/50 focus:ring-offset-2 focus:ring-offset-white"
                    >
                        Confirmar Aluguel Agora
                    </button>
                </form>
            </div>
        </div>
    );
}