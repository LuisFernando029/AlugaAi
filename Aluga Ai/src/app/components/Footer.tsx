import Link from 'next/link'; 

export default function Footer() {
  return (
    <footer className="text-center py-4 border-t border-white/20 bg-[#417FF2]">
      <p className="text-sm text-white">
        &copy; {new Date().getFullYear()} Aluga Ai - Todos os direitos reservados.
        <br />
        <Link href="/home" className="text-white hover:underline mt-1 block">
          Voltar para a Home
        </Link>
      </p>
    </footer>
  );
}