import "./index.css";
import { LogOut, Clipboard } from "lucide-react";
import { useNavigate } from "react-router";

function Configuracoes() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authenticated");
    navigate("/");
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <h1>MedCard</h1>
        </div>
        <div className="header-right">
          <button className="btn-primary" onClick={() => {navigate("/home")}}>
            <>
              <Clipboard /> Fichas
            </>
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <>
              <LogOut /> Sair
            </>
          </button>
        </div>
      </header>
    </>
  );
}

export default Configuracoes;
