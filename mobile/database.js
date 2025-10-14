import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "medical_records.db";
let db = null;

// Inicializa o banco de dados
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    // Cria a tabela de pacientes se não existir
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age TEXT NOT NULL,
        address TEXT NOT NULL,
        operation TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Banco de dados inicializado com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error);
    throw error;
  }
};

// Adiciona um novo paciente
export const addPatient = async (patient) => {
  try {
    if (!db) {
      throw new Error("Banco de dados não inicializado");
    }

    const result = await db.runAsync(
      "INSERT INTO patients (name, age, address, operation) VALUES (?, ?, ?, ?)",
      [patient.name, patient.age, patient.address, patient.operation]
    );

    console.log("Paciente adicionado com ID:", result.lastInsertRowid);
    return result.lastInsertRowid;
  } catch (error) {
    console.error("Erro ao adicionar paciente:", error);
    throw error;
  }
};

// Obtém todos os pacientes
export const getAllPatients = async () => {
  try {
    if (!db) {
      throw new Error("Banco de dados não inicializado");
    }

    const allRows = await db.getAllAsync(
      "SELECT * FROM patients ORDER BY created_at DESC"
    );

    console.log("Pacientes carregados:", allRows.length);
    return allRows;
  } catch (error) {
    console.error("Erro ao obter pacientes:", error);
    throw error;
  }
};

// Obtém um paciente específico pelo ID
export const getPatientById = async (id) => {
  try {
    if (!db) {
      throw new Error("Banco de dados não inicializado");
    }

    const patient = await db.getFirstAsync(
      "SELECT * FROM patients WHERE id = ?",
      [id]
    );

    return patient;
  } catch (error) {
    console.error("Erro ao obter paciente:", error);
    throw error;
  }
};

// Atualiza um paciente existente
export const updatePatient = async (id, patient) => {
  try {
    if (!db) {
      throw new Error("Banco de dados não inicializado");
    }

    const result = await db.runAsync(
      "UPDATE patients SET name = ?, age = ?, address = ?, operation = ? WHERE id = ?",
      [patient.name, patient.age, patient.address, patient.operation, id]
    );

    console.log("Paciente atualizado");
    return result;
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    throw error;
  }
};

// Deleta um paciente
export const deletePatient = async (id) => {
  try {
    if (!db) {
      throw new Error("Banco de dados não inicializado");
    }

    const result = await db.runAsync("DELETE FROM patients WHERE id = ?", [id]);

    console.log("Paciente deletado");
    return result;
  } catch (error) {
    console.error("Erro ao deletar paciente:", error);
    throw error;
  }
};

// Deleta todos os pacientes (útil para testes)
export const deleteAllPatients = async () => {
  try {
    if (!db) {
      throw new Error("Banco de dados não inicializado");
    }

    await db.execAsync("DELETE FROM patients");
    console.log("Todos os pacientes foram deletados");
  } catch (error) {
    console.error("Erro ao deletar todos os pacientes:", error);
    throw error;
  }
};
