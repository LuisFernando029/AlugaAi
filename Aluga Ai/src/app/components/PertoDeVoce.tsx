import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function PertoDeVoce({ children }: { children: ReactNode }) {
  return (
    <div>
      <div>
      {children}
    </div>
    </div>
  );
}