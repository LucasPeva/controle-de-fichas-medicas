import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Clipboard, LogOut, Settings, UserPlus, Edit, Trash2, Users } from "lucide-react";
import styles from "./Usuarios.module.css";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/api/usuarios";

  // Verificar autenticação ao carregar
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("authenticated");
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    carregarUsuarios();
  }, [navigate]);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao carregar usuários");
      const data = await response.json();
      setUsuarios(data);
      setError("");
    } catch (err) {
      setError("Erro ao carregar os dados");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username) {
      setError("Preencha o nome de usuário.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      let response;

      if (editingId) {
        // Atualizar usuário
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password || undefined, // Só enviar se houver nova senha
          }),
        });
      } else {
        // Criar novo usuário
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        console.log(response)
        throw new Error("Erro ao salvar usuário");
      };

      await carregarUsuarios();
      setFormData({ username: "", password: "" });
      setShowForm(false);
      setEditingId(null);
      setError("");
    } catch (err) {
      setError("Erro ao salvar os dados");
      console.error(err);
    }
  };

  const handleEdit = (usuario) => {
    setFormData({
      username: usuario.username,
      password: "",
    });
    setEditingId(usuario.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?"))
      return;

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao deletar usuário");

      await carregarUsuarios();
      setError("");
    } catch (err) {
      setError("Erro ao deletar o usuário");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ username: "", password: "" });
    setError("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authenticated");
    navigate("/");
  };

  return (
    <div className="app">
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
          {!showForm && (
            <button
              className={styles.btnPrimary}
              onClick={() => setShowForm(!showForm)}
              disabled={loading}
            >
              <>
                <UserPlus /> Novo Usuário
              </>
            </button>
          )}
          <button className={styles.btnLogout} onClick={handleLogout}>
            <>
              <LogOut /> Sair
            </>
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {showForm ? (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <h2>{editingId ? "Editar Usuário" : "Adicionar Novo Usuário"}</h2>

          <div className={styles.formGroup}>
            <label>Nome de Usuário</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              maxLength="50"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Senha {editingId && "(deixe em branco para não alterar)"}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              maxLength="100"
            />
          </div>

          <div className={styles.formButtons}>
            <button type="submit" className="btn-success">
              {editingId ? "Atualizar" : "Salvar"}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.listContainer}>
          {loading ? (
            <p>Carregando usuários...</p>
          ) : usuarios.length === 0 ? (
            <p className="empty-state">Nenhum usuário cadastrado</p>
          ) : (
            <div className={styles.usuariosGrid}>
              {usuarios.map((usuario) => (
                <div key={usuario.id} className={styles.usuarioCard}>
                  <div className={styles.cardHeader}>
                    <h3>{usuario.username}</h3>
                    <span className={styles.idBadge}>ID: {usuario.id}</span>
                  </div>

                  <div className={styles.cardContent}>
                    <p>
                      <strong>Criado em:</strong> {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(usuario)}
                    >
                      <Edit />
                      <p>Editar</p>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(usuario.id)}
                    >
                      <Trash2 />
                      <p>Remover</p>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Usuarios;