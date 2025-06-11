// app/devolver/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface OrderItem {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  item: {
    id: string;
    name: string;
    description: string;
    store: {
      id: string;
      name: string;
    };
  };
}

export default function DevolverItemPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID do pedido não fornecido.");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          throw new Error("Erro ao buscar os detalhes do pedido.");
        }

        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluido":
        return "text-green-600";
      case "cancelado":
        return "text-red-500";
      case "pendente":
        return "text-yellow-600";
      default:
        return "text-gray-500";
    }
  };

  const handleRealizarPagamento = async () => {
    if (!order || isProcessingPayment) return; // Evita cliques múltiplos

    setIsProcessingPayment(true);
    setError(null); // Limpa erros anteriores

    try {
      // 1. Criar o registro de pagamento
      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.totalPrice,
          type: "Aluguel", // Ou outro tipo apropriado
          method: "Cartão de Crédito", // Ou outro método
          paymentDate: new Date().toISOString(), // Data atual do pagamento
        }),
      });

      if (!paymentRes.ok) {
        const errorData = await paymentRes.json();
        throw new Error(
          errorData.error || "Falha ao registrar o pagamento."
        );
      }

      // 2. Atualizar o status do pedido para "concluido"
      const updateOrderRes = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...order, 
          status: "concluido", // Altera apenas o status
        }),
      });

      if (!updateOrderRes.ok) {
        const errorData = await updateOrderRes.json();
        throw new Error(
          errorData.error || "Falha ao atualizar o status do pedido."
        );
      }

      // 3. Marcar o item como DISPONÍVEL novamente
      const updateItemAvailabilityRes = await fetch(`/api/items/${order.item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: true }), // Atualiza para true
      });

      if (!updateItemAvailabilityRes.ok) {
        console.error("Falha ao atualizar status do item para disponível.");
  
      }

      setOrder((prevOrder) => ({ ...prevOrder!, status: "concluido" }));
      router.push("/success");
    } catch (err: any) {
      console.error("Erro ao realizar pagamento ou devolver item:", err);
      setError(err.message || "Ocorreu um erro ao processar a devolução.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
        <p className="text-white text-2xl font-medium animate-pulse">
          Carregando detalhes do aluguel...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
        <div className="text-center p-6 bg-red-800 text-white rounded-lg shadow-md">
          {error}
          <Link
            href="/meus-pedidos"
            className="block mt-4 text-white hover:underline"
          >
            Voltar para Meus Pedidos
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#417FF2] flex items-center justify-center">
        <div className="text-center p-6 bg-white bg-opacity-10 rounded-2xl shadow-inner text-white">
          <p className="text-xl font-light mb-4">Pedido não encontrado.</p>
          <Link href="/meus-pedidos" className="text-white hover:underline">
            Voltar para Meus Pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-[#417FF2] py-16 px-4 flex flex-col items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-xl overflow-hidden flex flex-col animate-fade-in-down">
          {/* Lado Superior (Detalhes do Item) */}
          <div className="bg-[#0257f5] text-white p-8 flex flex-col justify-center items-center text-center">
            <h3 className="text-3xl font-extrabold mb-2">{order.item.name}</h3>
            <p className="text-base text-blue-100 mb-4">
              {order.item.description}
            </p>
            <div className="border-t border-blue-300 w-2/3 pt-4">
              <p className="text-xl font-bold">
                Total do Aluguel: R$ {order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Lado Inferior (Detalhes do Aluguel e Pagamento) */}
          <div className="p-8 space-y-6 text-[#417FF2]">
            <h2 className="text-3xl font-bold text-center mb-4">
              Detalhes do Pedido
            </h2>

            <div className="space-y-3 text-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Período:</span>
                <span className="font-semibold">
                  {formatDate(order.startDate)} até {formatDate(order.endDate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Loja:</span>
                <span className="font-semibold">
                  {order.item.store.name || "Não informada"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Status:</span>
                <span
                  className={`font-semibold ${getStatusTextColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {order.status.toLowerCase() === "pending" && (
              <button
                onClick={handleRealizarPagamento}
                className={`w-full bg-[#417FF2] text-white py-3 rounded-lg font-bold text-lg shadow-md mt-6
                  ${isProcessingPayment ? "opacity-70 cursor-not-allowed" : "hover:bg-[#355ec9] transition"}`}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? "Processando..." : "Realizar Pagamento e Devolver"}
              </button>
            )}

            <Link
              href="/meus-pedidos"
              className="block text-center text-sm text-[#417FF2] hover:underline mt-4"
            >
              Voltar para Meus Pedidos
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}