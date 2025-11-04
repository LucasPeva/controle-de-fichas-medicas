import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ClipboardPlus, LogOut, Pen, Settings, Trash2 } from "lucide-react";
import "../index.css"

function ListaFichas() {
  const [pacientes, setPacientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    cep: "",
    endereco: "",
    operacao: "",
    anotacoes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/api/pacientes";

  // Verificar autenticação ao carregar
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("authenticated");
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao carregar pacientes");
      const data = await response.json();
      setPacientes(data);
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

    if (name === "cep" && value.length === 8) {
      buscarCEP(value);
    }
  };

  const buscarCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("Erro ao buscar CEP");

      const data = await response.json();

      if (data.erro) {
        setError("CEP não encontrado");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        endereco: `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`,
      }));
      setError("");
    } catch (err) {
      setError("Erro ao buscar endereço pelo CEP");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nome ||
      !formData.idade ||
      !formData.cep ||
      !formData.endereco ||
      !formData.operacao
    ) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      let response;

      if (editingId) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) throw new Error("Erro ao salvar paciente");

      await carregarPacientes();
      setFormData({ nome: "", idade: "", cep: "", endereco: "", operacao: "" });
      setShowForm(false);
      setEditingId(null);
      setError("");
    } catch (err) {
      setError("Erro ao salvar os dados");
      console.error(err);
    }
  };

  const handleEdit = (paciente) => {
    setFormData(paciente);
    setEditingId(paciente.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este paciente?"))
      return;

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao deletar paciente");

      await carregarPacientes();
      setError("");
    } catch (err) {
      setError("Erro ao deletar o paciente");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nome: "", idade: "", cep: "", endereco: "", operacao: "" });
    setError("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authenticated");
    navigate("/");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>MedCard</h1>
        </div>
        <div className="header-right">
          {!showForm && (
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
              disabled={loading}
            >
              <>
                <ClipboardPlus /> Nova Ficha
              </>
            </button>
          )}
          <button
            className="btn-settings"
            onClick={() => {
              navigate("/configuracoes");
            }}
          >
            <>
              <Settings /> Configurações
            </>
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <>
              <LogOut /> Sair
            </>
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {showForm ? (
        <form className="form-container" onSubmit={handleSubmit}>
          <h2>{editingId ? "Editar Paciente" : "Adicionar Novo Paciente"}</h2>

          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Idade</label>
            <input
              type="text"
              name="idade"
              value={formData.idade}
              onChange={handleInputChange}
              maxLength="3"
            />
          </div>

          <div className="form-group">
            <label>CEP</label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              maxLength="9"
            />
          </div>

          <div className="form-group">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              placeholder="O endereço será preenchido automaticamente"
              readOnly
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Operação Realizada</label>
            <input
              type="text"
              name="operacao"
              value={formData.operacao}
              onChange={handleInputChange}
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label>Anotações Extras</label>
            <input
              type="text"
              name="anotacoes"
              value={formData.anotacoes}
              onChange={handleInputChange}
              maxLength="1000"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-success">
              {editingId ? "Atualizar" : "Salvar"}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="list-container">
          {loading ? (
            <p>Carregando pacientes...</p>
          ) : pacientes.length === 0 ? (
            <p className="empty-state">Nenhuma ficha médica cadastrada</p>
          ) : (
            <div className="pacientes-grid">
              {pacientes.map((paciente) => (
                <div key={paciente.id} className="paciente-card">
                  <div className="card-header">
                    <h3>{paciente.nome}</h3>
                    <span className="id-badge">ID: {paciente.id}</span>
                  </div>

                  <div className="card-content">
                    <p>
                      <strong>Idade:</strong> {paciente.idade} anos
                    </p>
                    <p>
                      <strong>Endereço:</strong> {paciente.endereco}
                    </p>
                    <p>
                      <strong>Operação:</strong> {paciente.operacao}
                    </p>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(paciente)}
                    >
                      <Pen />
                      <p>Editar</p>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(paciente.id)}
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

export default ListaFichas;
