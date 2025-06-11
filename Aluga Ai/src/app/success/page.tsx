// src/app/success/page.tsx
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Sua transação foi concluída com sucesso.");
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
  
    if (typeof window === 'undefined') {

      return; 
    }

    // Tenta obter o orderId do localStorage, que foi setado na página de aluguel/devolução
    const orderId = localStorage.getItem('currentOrderId') || localStorage.getItem('currentOrderIdToReturn');

    const updateItemAvailability = async (idDoPedido: string) => {
      try {
        // Primeiro, obtenha os detalhes do pedido para pegar o item.id
        const orderRes = await fetch(`/api/orders/${idDoPedido}`);
        if (!orderRes.ok) {
          throw new Error("Erro ao buscar detalhes do pedido.");
        }
        const orderData = await orderRes.json();
        const itemId = orderData.item.id;

        const isReturnSuccess = localStorage.getItem('currentOrderIdToReturn') !== null;
        const targetAvailability = isReturnSuccess ? true : false; // Se veio da devolução, item vira disponível.

        const updateItemRes = await fetch(`/api/items/${itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isAvailable: targetAvailability }),
        });

        if (!updateItemRes.ok) {
          console.error("Falha ao atualizar a disponibilidade do item.");
          setMessage("Pagamento confirmado, mas houve um problema ao atualizar a disponibilidade do item.");
        } else {
          setMessage("Pagamento confirmado e disponibilidade do item atualizada!");
        }

      } catch (err: any) {
        console.error("Erro ao processar sucesso:", err);
        setMessage("Sua transação foi concluída, mas houve um erro ao finalizar o processo no sistema.");
      } finally {
        setProcessing(false);
        // Limpa os IDs do localStorage após o processamento
        localStorage.removeItem('currentOrderId');
        localStorage.removeItem('currentOrderIdToReturn');
      }
    };

    if (orderId) {
      updateItemAvailability(orderId);
    } else {
      setMessage("Pagamento confirmado.");
      setProcessing(false);
    }

    const timer = setTimeout(() => {
      router.push("/meus-pedidos");
    }, 5000); // Redireciona após 5 segundos

    return () => clearTimeout(timer);
  }, []); // Dependência vazia para rodar apenas uma vez

  return (
    <div className="min-h-screen bg-[#417FF2] py-16 px-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl text-center flex flex-col items-center justify-center animate-fade-in-down">
        {processing ? (
          <>
            <p className="text-xl font-light mb-4 text-[#417FF2]">Processando confirmação...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#417FF2]"></div>
          </>
        ) : (
          <>
            <svg
              className="w-24 h-24 text-green-500 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="text-4xl font-extrabold text-[#417FF2] mb-4">
              Sucesso!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              {message}
            </p>
            <p className="text-md text-gray-500">
              Você será redirecionado(a) para seus pedidos em breve...
            </p>
          </>
        )}
        <button
          onClick={() => router.push("/meus-pedidos")}
          className="mt-8 px-6 py-3 bg-[#417FF2] text-white rounded-lg hover:bg-[#355ec9] transition font-bold text-lg shadow-md"
        >
          Ir para Meus Pedidos
        </button>
      </div>
    </div>
  );
}