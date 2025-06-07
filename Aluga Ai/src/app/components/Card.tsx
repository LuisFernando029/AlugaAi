"use client";

import { useEffect, useState } from "react";

type ItemWithStore = {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  securityDeposit: number;
  isAvailable: boolean;
  store: {
    id: string;
    name: string;
  };
};

export default function Card() {
  const [items, setItems] = useState<ItemWithStore[]>([]);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const handleAlugar = (itemId: string) => {
    alert(`Você alugou o item com ID: ${itemId}`);
    // Aqui você pode redirecionar, abrir um modal ou chamar uma rota POST para processar o aluguel
  };

return (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white text-[#417FF2] rounded-2xl shadow-xl p-6 flex flex-col justify-between transition-transform hover:scale-105 duration-300"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className="text-sm text-[#417FF2]/80">{item.description}</p>
            <p className="text-sm">
              <span className="font-medium text-[#417FF2]">Loja:</span>{" "}
              <span className="font-semibold">{item.store?.name || "Loja não encontrada"}</span>
            </p>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Preço:</span>
              <span className="text-[#417FF2] font-semibold">
                R$ {item.pricePerDay.toFixed(2)} / dia
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Depósito:</span>
              <span className="text-[#417FF2] font-semibold">
                R$ {item.securityDeposit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Status:</span>
              <span
                className={`font-semibold ${
                  item.isAvailable ? "text-green-600" : "text-red-500"
                }`}
              >
                {item.isAvailable ? "Disponível" : "Indisponível"}
              </span>
            </div>

            <button
              disabled={!item.isAvailable}
              onClick={() => handleAlugar(item.id)}
              className={`mt-4 w-full py-2 rounded-md text-white font-medium transition-colors duration-200 ${
                item.isAvailable
                  ? "bg-[#417FF2] hover:bg-[#305ec9]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Alugar
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}
