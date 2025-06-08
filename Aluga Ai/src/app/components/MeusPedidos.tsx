// components/MeusPedidos.tsx
"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const uid = userData?.user?.id;
    if (!uid) return;

    setUserId(uid);
    fetch(`/api/orders?userId=${uid}`)
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  if (!userId) {
    return <div className="text-center mt-10 text-red-500">Usuário não autenticado.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Meus Pedidos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white text-[#417FF2] rounded-2xl shadow-xl p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <h2 className="text-xl font-bold">{order.item.name}</h2>
              <p className="text-sm text-[#417FF2]/80">{order.item.description}</p>
              <p className="text-sm">
                <span className="font-medium">Loja:</span> {order.item.store?.name || "Loja não encontrada"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Período:</span> {new Date(order.startDate).toLocaleDateString()} até {new Date(order.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Total:</span> R$ {order.totalPrice.toFixed(2)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> {order.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
