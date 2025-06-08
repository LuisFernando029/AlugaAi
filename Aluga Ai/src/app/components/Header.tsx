"use client";
import { useEffect, useState, useRef } from "react";
import { UserIcon, BuildingStorefrontIcon, Bars3Icon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { user, store, loading, logout } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user && !store) {
      router.push("/login");
    }
  }, [user, store, loading, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return null;
  if (!user && !store) return null;

  const name = user?.name || store?.name;
  const email = user?.email || store?.email;
  // **Esta é a variável que usaremos para a renderização condicional**
  const isStore = !!store; 

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-[#F0F0F0] p-4 shadow-md border-b border-white/20 w-full">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center relative">
        <Link href="/">
          <Image src="/AlugaAi-logo-png.png" alt="Logo AlugaAi" width={100} height={60} />
        </Link>
        <div className="flex items-center space-x-4" ref={menuRef}>
          <div className="text-right hidden sm:block">
            <p className="text-[#417FF2] font-semibold text-sm sm:text-base">{name}</p>
            <p className="text-[#417FF2] text-xs sm:text-sm">{email}</p>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#417FF2]"
            aria-label="Abrir menu"
          >
            <Bars3Icon className="w-8 h-8 text-[#417FF2]" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200 animate-fade-in-up">
              {/* Renderização condicional: Mostra "Meus Pedidos" APENAS se NÃO for uma loja */}
              {!isStore && (
                <Link
                  href="/meus-pedidos"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-[#417FF2] hover:bg-gray-100"
                >
                  Meus Pedidos
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}