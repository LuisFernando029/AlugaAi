"use client";
import { useEffect } from "react";
import { UserIcon, BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { user, store, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !store) {
      router.push("/login");
    }
  }, [user, store, loading]);

  if (loading) return null;
  if (!user && !store) return null;

  const name = user?.name || store?.name;
  const email = user?.email || store?.email;
  const isStore = !!store;

  return (
    <header className="bg-[#F0F0F0] p-4 shadow-md border-b border-white/20 w-full">
      <div className="max-w-screen-xl mx-auto flex justify-between">
        <Link href="/">
          <Image src="/AlugaAi-logo-png.png" alt="Logo AlugaAi" width={100} height={60} />
        </Link>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-[#417FF2] font-semibold text-sm sm:text-base">{name}</p>
            <p className="text-[#417FF2] text-xs sm:text-sm">{email}</p>
          </div>
          {isStore ? (
            <BuildingStorefrontIcon className="w-8 h-8 text-[#417FF2]" />
          ) : (
            <UserIcon className="w-8 h-8 text-[#417FF2]" />
          )}
        </div>
      </div>
    </header>
  );
}
