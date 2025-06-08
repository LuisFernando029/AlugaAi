// components/MeusPedidos.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importe o useRouter

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

export default function MeusPedidos() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Inicialize o useRouter

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const uid = userData?.user?.id;

    if (!uid) {
      setLoading(false);
      setError("Usuário não autenticado. Por favor, faça login para ver seus pedidos.");
      return;
    }

    setUserId(uid);
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${uid}`);
        if (!res.ok) {
          throw new Error("Falha ao carregar os pedidos.");
        }
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro ao buscar seus pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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

  const handleDevolverItemClick = (orderId: string) => {
    // Redireciona para a nova página de detalhes de devolução
    router.push(`/devolver/${orderId}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-white animate-pulse">
        Carregando seus pedidos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 p-6 bg-red-800 text-white rounded-lg shadow-md">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-10 p-6 bg-white bg-opacity-10 rounded-2xl shadow-inner text-white">
        <p className="text-xl font-light mb-4">Parece que você ainda não alugou nada por aqui!</p>
        <p className="text-lg">Que tal explorar nossos itens disponíveis e começar sua primeira locação?</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white text-[#417FF2] rounded-2xl shadow-xl p-6 flex flex-col justify-between transition-transform hover:scale-105 duration-300"
          >
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">{order.item.name}</h2>
              <p className="text-sm text-[#417FF2]/80">{order.item.description}</p>
              <p className="text-sm">
                <span className="font-medium text-[#417FF2]">Loja:</span>{" "}
                <span className="font-semibold">{order.item.store?.name || "Loja não encontrada"}</span>
              </p>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Período:</span>
                <span className="text-[#417FF2] font-semibold">
                  {formatDate(order.startDate)} até {formatDate(order.endDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="text-[#417FF2] font-semibold">
                  R$ {order.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Status:</span>
                <span
                  className={`font-semibold ${getStatusTextColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              {order.status.toLowerCase() === "pending" && (
                <button
                  onClick={() => handleDevolverItemClick(order.id)} 
                    className="mt-4 w-full py-2 rounded-md text-white font-medium transition-colors duration-200 bg-[#417FF2] hover:bg-[#9dbaf0] focus:outline-none focus:ring-2 focus:ring-[#417FF2]focus:ring-opacity-50"
                >
                  Devolver Item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}