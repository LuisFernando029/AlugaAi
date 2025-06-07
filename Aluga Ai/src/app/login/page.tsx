import Footer from "../components/Footer";

import HeaderPadrao from "../components/HeaderPadrao";
import LoginPage from "../components/login";
import PageTransition from "../components/PageTransition";


export default function Login() {
  return (
    
    <div>
      <PageTransition direction="left">
          <HeaderPadrao/>
          <LoginPage/>
      </PageTransition>
    </div>
  );
}
