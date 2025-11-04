import { LogOut, Clipboard, Wrench } from "lucide-react";
import { useNavigate } from "react-router";
import styles from "./configuracoes.module.css"

function Configuracoes() {
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
          <button className={styles.btnLogout} onClick={handleLogout}>
            <>
              <LogOut /> Sair
            </>
          </button>
        </div>
      </header>
      <div className={styles.listContainer}>
        <div className={styles.pacientesGrid}>
          <div className={styles.pacienteCard}>
            <div className={styles.cardHeader}>
              <h3>Usuários</h3>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.cardActions}>
                <button className={styles.btnEdit} onClick={() => {navigate("/configuracoes/usuarios")}}>
                  <Wrench />
                  <p>Editar</p>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Configuracoes;
