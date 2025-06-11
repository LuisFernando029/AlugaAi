"use client";

export default function FailurePage() {
  return (
    <div className="min-h-screen bg-[#417FF2] py-16 px-4 flex flex-col items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl text-center flex flex-col items-center justify-center animate-fade-in-down">
        <svg
          className="w-24 h-24 text-red-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h2 className="text-4xl font-extrabold text-red-600 mb-4">
          Pagamento Falhou!
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Ocorreu um problema ao processar sua transação.
        </p>
        <p className="text-md text-gray-500">
          Por favor, tente novamente ou verifique os detalhes do seu pagamento.
        </p>
        <button
          onClick={() => (window.location.href = "/home")} // Usando window.location.href para navegação
          className="mt-8 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold text-lg shadow-md"
        >
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
}
