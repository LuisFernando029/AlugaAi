"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isStore, setIsStore] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const endpoint = isStore ? "/api/stores" : "/api/users";

    // Prepara os dados (loja não precisa de phone)
    const payload = isStore
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      : formData;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("Cadastro realizado com sucesso!");
        router.push("/login");
      } else {
        const data = await res.json();
        setMessage(data.error || "Erro ao cadastrar.");
      }
    } catch (err) {
      setMessage("Erro de rede ou servidor.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#417FF2] px-4">
      <div className="mb-24 w-full max-w-md bg-white rounded-md shadow-md p-8 text-[#417FF2] mt-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Cadastro</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {["name", "email", "phone", "password"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium mb-1">
                {field === "name"
                  ? "Nome"
                  : field === "email"
                  ? "E-mail"
                  : field === "phone"
                  ? "Telefone"
                  : "Senha"}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                name={field}
                required={field !== "phone" || !isStore}
                disabled={isStore && field === "phone"} // desativa campo telefone se for loja
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#417FF2]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#417FF2]"
                placeholder={
                  field === "name"
                    ? "Seu nome completo"
                    : field === "email"
                    ? "seu@email.com"
                    : field === "phone"
                    ? "(00) 00000-0000"
                    : "••••••••"
                }
              />
            </div>
          ))}

          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={isStore}
              onChange={(e) => setIsStore(e.target.checked)}
              className="accent-[#417FF2]"
            />
            <span>Sou uma loja</span>
          </label>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#417FF2] hover:bg-[#3a6fd9] text-white font-medium rounded-md transition-colors"
          >
            Cadastrar
          </button>

          {message && (
            <p className="text-center text-sm text-[#417FF2] pt-2">{message}</p>
          )}

          <p className="text-center text-sm text-[#417FF2] pt-2">
            Já possui conta?{" "}
            <Link href="/login" className="font-semibold hover:underline">
              Entre agora!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
