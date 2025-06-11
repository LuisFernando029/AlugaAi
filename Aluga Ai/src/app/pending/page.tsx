"use client";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-[#417FF2] py-16 px-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl text-center flex flex-col items-center justify-center animate-fade-in-down">
        <svg
          className="w-24 h-24 text-yellow-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h2 className="text-4xl font-extrabold text-yellow-600 mb-4">
          Pagamento Pendente
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Sua transação está aguardando confirmação.
        </p>
        <p className="text-md text-gray-500">
          Por favor, aguarde a atualização do status. Você pode verificar o progresso em "Meus Pedidos".
        </p>
        <button
          onClick={() => (window.location.href = "/meus-pedidos")}
          className="mt-8 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-bold text-lg shadow-md"
        >
          Verificar Status do Pedido
        </button>
      </div>
    </div>
  );
}
