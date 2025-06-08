// // /app/alugar/[id]/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Item } from "@prisma/client";

// export default function AlugarPage() {
//     const params = useParams();
//     const id = params?.id;

//     const router = useRouter();
//     const [item, setItem] = useState<Item | null>(null);
//     const [startDate, setStartDate] = useState("");
//     const [durationDays, setDurationDays] = useState(1);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (!id || Array.isArray(id)) return;
//         fetch(`/api/items/${id}`)
//             .then((res) => res.json())
//             .then(setItem);
//     }, [id]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");

//         if (!startDate || durationDays < 1) {
//             return setError("Preencha todos os campos corretamente.");
//         }

//         try {
//             const userData = JSON.parse(localStorage.getItem("userData") || "{}");
//             const userId = userData?.user?.id;
//             if (!userId) return setError("Usuário não autenticado.");

//             const res = await fetch("/api/orders", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     itemId: id,
//                     userId,
//                     startDate,
//                     durationDays
//                 })
//             });

//             const data = await res.json();
//             if (!res.ok) {
//                 return setError(data.error || "Erro ao criar pedido.");
//             }

//             router.push("/home");
//         } catch (err) {
//             setError("Erro no servidor.");
//         }
//     };

//     if (!id || Array.isArray(id)) {
//         return <div className="text-center text-red-500 mt-10">ID inválido.</div>;
//     }

//     if (!item) {
//         return <p className="text-white text-center mt-10">Carregando...</p>;
//     }

//     return (
//         <div className="min-h-screen bg-[#417FF2] py-12 px-4 flex items-start justify-center">
//             <form
//                 onSubmit={handleSubmit}
//                 className="bg-white rounded shadow p-6 w-full max-w-xl space-y-4"
//             >
//                 <h2 className="text-2xl font-bold text-[#417FF2]">Alugar Item</h2>

//                 <div>
//                     <h3 className="text-lg font-semibold text-[#417FF2]">{item.name}</h3>
//                     <p className="text-sm text-gray-600">{item.description}</p>
//                     <p className="text-sm text-gray-700 mt-1">
//                         R$ {item.pricePerDay.toFixed(2)} / dia | Caução: R$ {item.securityDeposit.toFixed(2)}
//                     </p>
//                 </div>

//                 <div>
//                     <label className="block text-[#417FF2] font-medium mb-1">Data de Início:</label>
//                     <input
//                         type="date"
//                         value={startDate}
//                         onChange={(e) => setStartDate(e.target.value)}
//                         className="w-full p-2 border rounded text-[#417FF2] focus:ring-1 focus:ring-[#417FF2] outline-none"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-[#417FF2] font-medium mb-1">Quantidade de dias:</label>
//                     <input
//                         type="number"
//                         value={durationDays}
//                         onChange={(e) => setDurationDays(Number(e.target.value))}
//                         min={1}
//                         className="w-full p-2 border rounded text-[#417FF2] focus:ring-1 focus:ring-[#417FF2] outline-none"
//                         required
//                     />
//                 </div>

//                 {error && (
//                     <p className="text-red-500 text-sm">{error}</p>
//                 )}

//                 <button
//                     type="submit"
//                     className="w-full bg-[#417FF2] text-white py-2 rounded hover:bg-[#355ec9] transition font-semibold"
//                 >
//                     Confirmar Aluguel
//                 </button>
//             </form>
//         </div>
//     );
// }
