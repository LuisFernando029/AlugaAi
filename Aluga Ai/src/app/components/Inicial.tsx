'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Inicial() {
  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-start pt-32 px-4">
      
      {/* Logo animada - desliza de cima */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12"
      >
        <Image
          src="/AlugaAi-logo-png.png"
          alt="Logo AlugaAi"
          width={220}
          height={120}
          className="mx-auto"
        />
      </motion.div>

      {/* Botão animado - fade com zoom leve */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Link
          href="/login"
          className="w-80 block text-center py-3 px-6 bg-[#417FF2] hover:bg-[#3a6fd9] text-white text-lg font-medium rounded-md transition-colors"
        >
          Entrar
        </Link>
      </motion.div>

      {/* Link de cadastro com animação */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-sm text-black mt-4"
      >
        Não possui uma conta?{' '}
        <Link href="/cadastro" className="font-semibold hover:underline text-[#417FF2]">
          Cadastre-se
        </Link>
      </motion.p>
    </div>
  );
}
