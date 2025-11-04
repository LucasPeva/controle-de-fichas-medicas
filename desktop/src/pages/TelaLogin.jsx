import { useState } from "react";
import { useNavigate } from "react-router";

function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {

    if (!formData.username || !formData.password) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao autenticar");
      }

      // Armazena o token 
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("authenticated", true);

      navigate("/home");
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>MedCard</h2>
        <p>Acesse seu sistema de fichas médicas</p>

        {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} onClick={handleSubmit}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
      </div>
    </div>
  );
}

export default LoginForm;
