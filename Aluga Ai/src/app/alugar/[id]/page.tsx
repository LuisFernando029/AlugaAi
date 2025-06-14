// app/alugar/[id]/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Item } from "@prisma/client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AlugarPage() {
    const params = useParams();
    const id = params?.id;
    const router = useRouter();

    const [item, setItem] = useState<Item | null>(null);
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
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
                if (!res.ok) throw new Error("Item não encontrado.");
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

    const calculateTotalPrice = useMemo(() => {
        if (!item || !startDate || !startTime || !endDate || !endTime) return 0;

        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        if (endDateTime <= startDateTime) return 0;

        const durationMs = endDateTime.getTime() - startDateTime.getTime();
        let durationHours = durationMs / (1000 * 60 * 60);

        const pricePerHour = (item as any).pricePerHour || item.pricePerDay / 24;

        const totalHoursToCharge = Math.ceil(durationHours);

        let total = totalHoursToCharge * pricePerHour;

        return total;
    }, [item, startDate, startTime, endDate, endTime]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!startDate || !startTime || !endDate || !endTime) {
            return setError("Por favor, preencha a data e hora de início e término.");
        }

        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);

        if (endDateTime <= startDateTime) {
            return setError(
                "A data e hora de término deve ser posterior à data e hora de início."
            );
        }

        if (!item) {
            return setError("Item não carregado. Tente recarregar a página.");
        }

        try {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const userId = Number(userData?.user?.id);
            if (!userId) {
                router.push("/login");
                return setError(
                    "Usuário não autenticado. Redirecionando para o login."
                );
            }

            const itemId = Number(id);
            if (isNaN(itemId)) return setError("ID do item inválido.");

            const finalTotalPrice = calculateTotalPrice;
            if (finalTotalPrice <= 0) {
                return setError(
                    "Não foi possível calcular o preço total. Verifique as datas e horas."
                );
            }

            // 1. Criar o pedido no seu backend
            const orderRes = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    itemId,
                    startDate: startDateTime.toISOString(),
                    endDate: endDateTime.toISOString(),
                    totalPrice: finalTotalPrice,
                    status: "pending",
                }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) {
                return setError(
                    orderData.error || "Ocorreu um erro ao criar o pedido. Tente novamente."
                );
            }

            // 2. Marcar o item como INDISPONÍVEL
            const updateItemStatusRes = await fetch(`/api/items/${itemId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isAvailable: false }), // Atualiza para false
            });

            if (!updateItemStatusRes.ok) {
                console.error("Falha ao atualizar status do item para indisponível.");
            }

            router.push("/alugado");

        } catch (err) {
            console.error("Erro ao processar pedido ou pagamento:", err);
            setError(
                "Erro interno do servidor. Por favor, tente novamente mais tarde."
            );
        }
    };

    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localNow = new Date(now.getTime() - offset);
    const minDateTimeLocal = localNow.toISOString().slice(0, 16);

    const handleSetStartDateTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [date, time] = e.target.value.split("T");
        setStartDate(date || "");
        setStartTime(time || "");
    };

    const handleSetEndDateTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [date, time] = e.target.value.split("T");
        setEndDate(date || "");
        setEndTime(time || "");
    };

    if (loading)
        return (
            <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
                <p className="text-white text-2xl font-medium animate-pulse">
                    Carregando...
                </p>
            </div>
        );
    if (error && !item)
        return (
            <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
                <p className="text-red-300 text-2xl font-medium text-center px-4">
                    {error}
                </p>
            </div>
        );
    if (!id || Array.isArray(id) || !item)
        return (
            <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
                <p className="text-red-300 text-2xl font-medium text-center px-4">
                    Item inválido.
                </p>
            </div>
        );

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-[#417FF2] py-16 px-4 flex flex-col items-center justify-center">
                <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-xl overflow-hidden flex flex-col md:flex-row animate-fade-in-down">
                    <div className="bg-[#0257f5] text-white p-8 md:w-1/2 flex flex-col justify-center items-center text-center">
                        <h3 className="text-3xl font-extrabold mb-2">{item.name}</h3>
                        <p className="text-base text-blue-100 mb-4">{item.description}</p>
                        <div className="border-t border-blue-300 w-2/3 pt-4">
                            <p className="text-xl font-bold">
                                R$ {item.pricePerDay.toFixed(2)} / dia
                            </p>
                            <p className="text-sm mt-1">
                                Caução: R$ {item.securityDeposit.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold text-[#417FF2] text-center mb-4">
                            Confirmar Aluguel
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="startDateTime"
                                    className="block text-[#417FF2] font-semibold mb-2">
                                    Início do Aluguel
                                </label>
                                <input
                                    id="startDateTime"
                                    type="datetime-local"
                                    value={
                                        startDate && startTime ? `${startDate}T${startTime}` : ""
                                    }
                                    onChange={handleSetStartDateTime}
                                    min={minDateTimeLocal}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#417FF2] focus:border-transparent transition"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="endDateTime"
                                    className="block text-[#417FF2] font-semibold mb-2">
                                    Término do Aluguel
                                </label>
                                <input
                                    id="endDateTime"
                                    type="datetime-local"
                                    value={endDate && endTime ? `${endDate}T${endTime}` : ""}
                                    onChange={handleSetEndDateTime}
                                    min={
                                        startDate && startTime
                                            ? `${startDate}T${startTime}`
                                            : minDateTimeLocal
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#417FF2] focus:border-transparent transition"
                                    required
                                />
                            </div>

                            {calculateTotalPrice > 0 && item && (
                                <div className="bg-[#eaf1fb] p-4 rounded-lg text-center border border-[#c1d1ee]">
                                    <p className="text-lg text-[#417FF2] font-medium mb-1">
                                        Total Estimado:
                                    </p>
                                    <p className="text-4xl font-extrabold text-[#417FF2]">
                                        R$ {calculateTotalPrice.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Baseado em R${" "}
                                        {(
                                            (item as any).pricePerHour || item.pricePerDay / 24
                                        ).toFixed(2)}{" "}
                                        por hora.
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        * Caução não inclusa neste valor.
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-[#417FF2] text-white py-3 rounded-lg hover:bg-[#355ec9] transition font-bold text-lg shadow-md">
                                Confirmar Aluguel
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}