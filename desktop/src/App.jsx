// App.js - Frontend React
import {Clipboard, ClipboardPlus, Pen, Trash, Trash2} from "lucide-react"
import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    endereco: '',
    operacao: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api/pacientes';

  // Carregar pacientes ao iniciar
  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao carregar pacientes');
      const data = await response.json();
      setPacientes(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar os dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.idade || !formData.endereco || !formData.operacao) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      let response;
      if (editingId) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      if (!response.ok) throw new Error('Erro ao salvar paciente');

      await carregarPacientes();
      setFormData({ nome: '', idade: '', endereco: '', operacao: '' });
      setShowForm(false);
      setEditingId(null);
      setError('');
    } catch (err) {
      setError('Erro ao salvar os dados');
      console.error(err);
    }
  };

  const handleEdit = (paciente) => {
    setFormData(paciente);
    setEditingId(paciente.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este paciente?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao deletar paciente');

      await carregarPacientes();
      setError('');
    } catch (err) {
      setError('Erro ao deletar o paciente');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nome: '', idade: '', endereco: '', operacao: '' });
    setError('');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>
          MedCard
        </h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancelar' : <><ClipboardPlus/> Nova Ficha</>}
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Editar Paciente' : 'Adicionar Novo Paciente'}</h2>
          
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Digite o nome do paciente"
            />
          </div>

          <div className="form-group">
            <label>Idade:</label>
            <input
              type="text"
              name="idade"
              value={formData.idade}
              onChange={handleInputChange}
              placeholder="Digite a idade"
            />
          </div>

          <div className="form-group">
            <label>Endereço:</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              placeholder="Digite o endereço"
            />
          </div>

          <div className="form-group">
            <label>Operação Realizada:</label>
            <input
              type="text"
              name="operacao"
              value={formData.operacao}
              onChange={handleInputChange}
              placeholder="Digite a operação realizada"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-success">
              {editingId ? 'Atualizar' : 'Salvar'}
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="list-container">
        {loading ? (
          <p>Carregando pacientes...</p>
        ) : pacientes.length === 0 ? (
          <p className="empty-state">Nenhuma ficha médica cadastrada</p>
        ) : (
          <div className="pacientes-grid">
            {pacientes.map(paciente => (
              <div key={paciente.id} className="paciente-card">
                <div className="card-header">
                  <h3>{paciente.nome}</h3>
                  <span className="id-badge">ID: {paciente.id}</span>
                </div>
                
                <div className="card-content">
                  <p><strong>Idade:</strong> {paciente.idade} anos</p>
                  <p><strong>Endereço:</strong> {paciente.endereco}</p>
                  <p><strong>Operação:</strong> {paciente.operacao}</p>
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
    </div>
  );
}

export default App;