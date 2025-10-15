// server.js - Backend Express.js com SQLite

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados SQLite
const db = new sqlite3.Database('./medical_records.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('Conectado ao SQLite');
    criarTabela();
  }
});

// Criar tabela se não existir
function criarTabela() {
  db.run(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      idade INTEGER NOT NULL,
      endereco TEXT NOT NULL,
      operacao TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// GET - Listar todos os pacientes
app.get('/api/pacientes', (req, res) => {
  db.all('SELECT * FROM pacientes ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json(rows);
    }
  });
});

// GET - Obter paciente por ID
app.get('/api/pacientes/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM pacientes WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else if (!row) {
      res.status(404).json({ erro: 'Paciente não encontrado' });
    } else {
      res.json(row);
    }
  });
});

// POST - Criar novo paciente
app.post('/api/pacientes', (req, res) => {
  const { nome, idade, endereco, operacao } = req.body;

  if (!nome || !idade || !endereco || !operacao) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  db.run(
    'INSERT INTO pacientes (nome, idade, endereco, operacao) VALUES (?, ?, ?, ?)',
    [nome, idade, endereco, operacao],
    function(err) {
      if (err) {
        res.status(500).json({ erro: err.message });
      } else {
        res.status(201).json({ id: this.lastID, nome, idade, endereco, operacao });
      }
    }
  );
});

// PUT - Atualizar paciente
app.put('/api/pacientes/:id', (req, res) => {
  const { id } = req.params;
  const { nome, idade, endereco, operacao } = req.body;

  if (!nome || !idade || !endereco || !operacao) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  db.run(
    'UPDATE pacientes SET nome = ?, idade = ?, endereco = ?, operacao = ? WHERE id = ?',
    [nome, idade, endereco, operacao, id],
    function(err) {
      if (err) {
        res.status(500).json({ erro: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ erro: 'Paciente não encontrado' });
      } else {
        res.json({ id: parseInt(id), nome, idade, endereco, operacao });
      }
    }
  );
});

// DELETE - Deletar paciente
app.delete('/api/pacientes/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM pacientes WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ erro: 'Paciente não encontrado' });
    } else {
      res.json({ mensagem: 'Paciente deletado com sucesso' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});