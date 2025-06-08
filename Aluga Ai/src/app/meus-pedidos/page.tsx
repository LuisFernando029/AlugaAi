// app/meus-pedidos/page.tsx
import Footer from "../components/Footer";
import Header from "../components/Header";
import MeusPedidos from "../components/MeusPedidos";

export default function MeusPedidosPage() {
	return (
		<div>
			<Header />
			<main className="min-h-screen bg-[#417FF2] py-12 px-4">
				<h2 className="text-[#F0F0F0] text-2xl font-light ml-4  sm:ml-10">Meus Pedidos</h2>
				<MeusPedidos />
			</main>
			<Footer/>
		</div>
	);
}
