"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao fazer login.");
      } else {
        const expiry = new Date().getTime() + 30 * 60 * 1000; // 30 minutos
        localStorage.setItem(
          "userData",
          JSON.stringify({ user: data.user, store: data.store, expiry })
        );

        // Atualiza o contexto
        setUser(data.user || data.store);

        // Redireciona com base no tipo de login
        if (data.store) {
          router.push("/admin");
        } else {
          router.push("/home");
        }
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#417FF2] px-4">
      <div className="mb-48 w-full max-w-md bg-white rounded-md shadow-md p-8 text-[#417FF2] mt-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#417FF2]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#417FF2]"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#417FF2]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#417FF2]"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#417FF2] hover:bg-[#3a6fd9] text-white font-medium rounded-md transition-colors"
          >
            Entrar
          </button>

          <p className="text-center text-sm text-[#417FF2] pt-2">
            Não possui uma conta?{" "}
            <Link href="/cadastro" className="font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
