"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TagIcon, BuildingStorefrontIcon, CurrencyDollarIcon, LockClosedIcon } from "@heroicons/react/24/outline"; // Ícones de exemplo

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
  const router = useRouter();

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const handleAlugar = (itemId: string) => {
    router.push(`/alugar/${itemId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative bg-white text-[#417FF2] rounded-2xl shadow-xl p-6 flex flex-col justify-between transition-transform hover:scale-105 duration-300 overflow-hidden"
          >
            {/* Ícone flutuante ou imagem de destaque (ex: um ícone de tag) */}
            <div className="absolute top-4 right-4 bg-[#0257f5] p-2 rounded-full shadow-lg">
              <TagIcon className="w-6 h-6 text-white" />
            </div>

            <div className="space-y-3 mb-4">
              <h2 className="text-2xl font-bold pb-2 border-b-2 border-[#0257f5] inline-block pr-4">
                {item.name}
              </h2>
              <p className="text-sm text-[#417FF2]/80">{item.description}</p>
              <p className="text-sm flex items-center">
                <BuildingStorefrontIcon className="w-4 h-4 mr-2 text-[#0257f5]" />
                <span className="font-medium text-[#417FF2]">Loja:</span>{" "}
                <span className="font-semibold ml-1">{item.store?.name || "Loja não encontrada"}</span>
              </p>
            </div>

            <div className="space-y-2 text-sm mt-auto"> {/* mt-auto empurra para baixo */}
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                <span className="font-medium flex items-center"><CurrencyDollarIcon className="w-4 h-4 mr-2 text-[#0257f5]" />Preço:</span>
                <span className="text-[#417FF2] font-bold text-base">
                  R$ {item.pricePerDay.toFixed(2)} / dia
                </span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="font-medium flex items-center"><LockClosedIcon className="w-4 h-4 mr-2 text-[#0257f5]" />Depósito:</span>
                <span className="text-[#417FF2] font-semibold">
                  R$ {item.securityDeposit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="font-medium">Status:</span>
                <span
                  className={`font-semibold ${item.isAvailable ? "text-green-600" : "text-red-500"}`}
                >
                  {item.isAvailable ? "Disponível" : "Indisponível"}
                </span>
              </div>

              <button
                disabled={!item.isAvailable}
                onClick={() => handleAlugar(item.id)}
                className={`mt-4 w-full py-2 rounded-md text-white font-medium text-lg transition-colors duration-200 ${
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