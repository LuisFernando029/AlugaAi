// src/app/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();
    const [message, setMessage] = useState("Sua transação foi concluída com sucesso!");
    const [showSpinner, setShowSpinner] = useState(true); // Controla a exibição do spinner e da mensagem inicial

    useEffect(() => {
        // Simula um pequeno atraso para a "confirmação" visual
        const initialDelay = setTimeout(() => {
            setShowSpinner(false); // Esconde o spinner
            setMessage("Seu aluguel foi confirmado! Prepare-se para usar seu novo item."); // Mensagem final
        }, 1500); // Exibe o spinner por 1.5 segundos

        // Redireciona para "meus-pedidos" após 5 segundos (contando a partir do carregamento da página)
        const redirectTimer = setTimeout(() => {
            router.push("/meus-pedidos");
        }, 5000); // Redireciona após 5 segundos

        // Limpa os timers se o componente for desmontado para evitar vazamentos de memória
        return () => {
            clearTimeout(initialDelay);
            clearTimeout(redirectTimer);
        };
    }, [router]); // `router` na dependência para garantir que `router.push` esteja atualizado

    return (
        <div className="min-h-screen bg-[#417FF2] py-16 px-4 flex flex-col items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl text-center flex flex-col items-center justify-center animate-fade-in-down">
                {showSpinner ? (
                    <>
                        <p className="text-xl font-light mb-4 text-[#417FF2]">Confirmando sua transação...</p>
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
                            Tudo Certo!
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