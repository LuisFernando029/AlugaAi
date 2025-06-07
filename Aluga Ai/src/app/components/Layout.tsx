import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import Header from "./Header";
import PertoDeVoce from "./PertoDeVoce";
import Footer from "./Footer";
import Linha from "./Linha";
import AlugadosRecentemente from "./AlugadosRecentemente";

export default function Layout({ children }: { children: ReactNode }) {
  return (
     <div className="min-h-screen bg-[#417FF2] text-white ">
      <Header />
      <section>
          <h1 className="text-[#F0F0F0] text-2xl font-light ml-4 mt-6 sm:ml-10">Perto de Você</h1>
      </section>
      <div className="container mx-auto mt-6 max-w-5xl md:ml-24 md:mr-24">
        <PertoDeVoce>
          {children}
        </PertoDeVoce>
      </div>

      <Linha />
      <section>
          <h1 className="text-[#F0F0F0] text-2xl font-light ml-4 mt-6 sm:ml-10">Alugados Recentemente</h1>
      </section>
      <div className="container mx-auto mt-6 max-w-5xl md:ml-24 md:mr-24 mb-10">
      <AlugadosRecentemente>
        {children}
      </AlugadosRecentemente>
      </div>
      <Footer />
    </div>
  );
}
