
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Linha from "./Linha";
import Card from "./Card"; 
import MeusPedidos from "./MeusPedidos";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#417FF2] text-white">
      <Header />


      <section className="py-8"> {/* Removi o padding horizontal fixo aqui para o Card gerenciar */}
        <h1 className="text-[#F0F0F0] text-3xl font-bold mb-6 text-center sm:text-left ml-4 sm:ml-10">Perto de Você</h1>

        <Card /> 
      </section>

      <Linha />

      <section className="py-8"> {/* Removi o padding horizontal fixo aqui para o MeusPedidos gerenciar */}
        <h1 className="text-[#F0F0F0] text-3xl font-bold mb-6 text-center sm:text-left ml-4 sm:ml-10">Alugados Recentemente</h1>

        <MeusPedidos /> 
      </section>

      <Footer />
    </div>
  );
}