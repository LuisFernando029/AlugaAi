import CadastroPage from "../components/cadastro";
import HeaderPadrao from "../components/HeaderPadrao";
import PageTransition from "../components/PageTransition";

export default function Cadastro() {
  return (
    <div>
       <PageTransition direction="right">
          <HeaderPadrao/>
          <CadastroPage/>
      </PageTransition>
    </div>
  );
}
