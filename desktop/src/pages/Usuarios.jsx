import { Clipboard, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router";
import styles from "./Usuarios.module.css"
function Usuarios() {
    const navigate = useNavigate();

    const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authenticated");
    navigate("/");
    };
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>MedCard</h1>
        </div>
        <div className={styles.headerRight}>
          <button
            className={styles.btnPrimary}
            onClick={() => {
              navigate("/home");
            }}
          >
            <>
              <Clipboard /> Fichas
            </>
          </button>
          <button
            className={styles.btnSettings}
            onClick={() => {
              navigate("/configuracoes");
            }}
          >
            <>
              <Settings /> Configurações
            </>
          </button>
          <button className={styles.btnLogout} onClick={handleLogout}>
            <>
              <LogOut /> Sair
            </>
          </button>
        </div>
      </header>
    </>
  );
}

export default Usuarios