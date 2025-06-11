// app/meus-pedidos/page.tsx
"use client"; // Adicione 'use client' se ainda não tiver, pois useRouter é um hook de cliente.

import { useRouter } from "next/navigation"; // Importe o useRouter para a página
import Footer from "../components/Footer";
import Header from "../components/Header";
import MeusPedidos from "../components/MeusPedidos";

export default function MeusPedidosPage() {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/home");
    };

    return (
        <div>
            <Header />
            <main className="min-h-screen bg-[#417FF2] py-12 px-4">
                <h2 className="text-[#F0F0F0] text-2xl font-light ml-4 sm:ml-10">Meus Pedidos</h2>
                <MeusPedidos />

                <div className="text-center mt-10">
                    <button
                        onClick={handleGoHome}
                        className="px-8 py-3 bg-[#0257f5] text-white rounded-lg hover:bg-[#0140a8] transition font-bold text-lg shadow-md"
                    >
                        Voltar para Home
                    </button>
                </div>
            </main>
            <Footer/>
        </div>
    );
}