"use client";
import { useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  // Enquanto verifica ou redireciona, evita renderizar conteúdo
  if (!user) return null;

  return (
    <header className="bg-[#F0F0F0] p-4 shadow-md border-b border-white/20 w-full">
      <div className="max-w-screen-xl mx-auto flex justify-between">
        <Link href="/">
          <Image src="/AlugaAi-logo-png.png" alt="Logo AlugaAi" width={100} height={60} />
        </Link>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-[#417FF2] font-semibold text-sm sm:text-base">{user.name}</p>
            <p className="text-[#417FF2] text-xs sm:text-sm">{user.email}</p>
          </div>
          <UserIcon className="w-8 h-8 text-[#417FF2]" />
        </div>
      </div>
    </header>
  );
}
