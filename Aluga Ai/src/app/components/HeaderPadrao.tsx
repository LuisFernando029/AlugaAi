import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function HeaderPadrao() {
  return (
    <header className="bg-[#F0F0F0] p-4 shadow-md border-b border-white/20 w-full">
  <div className="max-w-screen-xl mx-auto flex justify-center">
    <Link href="/">
      <Image src="/AlugaAi-logo-png.png" alt="Logo AlugaAi" width={100} height={60} />
    </Link>
  </div>
</header>

  );
}