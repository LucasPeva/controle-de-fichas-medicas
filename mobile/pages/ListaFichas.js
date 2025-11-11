import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getApiUrl } from '../config';

export default function ListaFichas() {
  const [pacientes, setPacientes] = useState([]);
  const [showForm, setShowForm] = useState();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    cep: '',
    endereco: '',
    operacao: '',
    anotacoes: '',
  });
  const [loading, setLoading] = useState();
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const [API_URL, setAPI_URL] = useState("");

  useEffect(() => {
    const loadApiUrl = async () => {
      const url = await getApiUrl('/api/pacientes');
      setAPI_URL(url);      
    };
    loadApiUrl();
  }, []);

  // Verificar autenticação ao carregar
  useEffect(() => {
    // const isAuthenticated = global.authenticated;
    // if (!isAuthenticated) {
    //   navigation.navigate('Login');
    //   return;
    // }

    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    setLoading(true);
    try {
      const token = global.token;
      const url = await getApiUrl('/api/pacientes')
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'cep' && value.length === 8) {
      buscarCEP(value);
    }
  };

  const buscarCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('Erro ao buscar CEP');

      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return;
      }

      setFormData(prev => ({
        ...prev,
        endereco: `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`,
      }));
      setError('');
    } catch (err) {
      setError('Erro ao buscar endereço pelo CEP');
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.nome ||
      !formData.idade ||
      !formData.cep ||
      !formData.endereco ||
      !formData.operacao
    ) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const token = global.token;
      let response;

      if (editingId) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) throw new Error('Erro ao salvar paciente');

      await carregarPacientes();
      setFormData({ nome: '', idade: '', cep: '', endereco: '', operacao: '', anotacoes: '' });
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
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja deletar este paciente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Deletar', 
          onPress: async () => {
            try {
              const token = global.token;
              const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) throw new Error('Erro ao deletar paciente');

              await carregarPacientes();
              setError('');
            } catch (err) {
              setError('Erro ao deletar o paciente');
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nome: '', idade: '', cep: '', endereco: '', operacao: '', anotacoes: '' });
    setError('');
  };

  const handleLogout = () => {
    delete global.token;
    delete global.authenticated;
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MedCard</Text>
        <View style={styles.headerRight}>
          {!showForm && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(!showForm)}
              disabled={loading}
            >
              <Text style={styles.addButtonText}>Nova Ficha</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Configuracoes')}
          >
            <Text style={styles.settingsButtonText}>Configurações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ScrollView style={styles.content}>
        {showForm ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editingId ? 'Editar Paciente' : 'Adicionar Novo Paciente'}
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={formData.nome}
                onChangeText={(text) => handleInputChange('nome', text)}
                placeholder="Digite o nome"
                maxLength={100}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Idade</Text>
              <TextInput
                style={styles.input}
                value={formData.idade}
                onChangeText={(text) => handleInputChange('idade', text)}
                placeholder="Digite a idade"
                maxLength={3}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>CEP</Text>
              <TextInput
                style={styles.input}
                value={formData.cep}
                onChangeText={(text) => handleInputChange('cep', text)}
                placeholder="Digite o CEP"
                maxLength={9}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Endereço</Text>
              <TextInput
                style={[styles.input, styles.inputReadOnly]}
                value={formData.endereco}
                onChangeText={(text) => handleInputChange('endereco', text)}
                placeholder="O endereço será preenchido automaticamente"
                editable={false}
                maxLength={100}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Operação Realizada</Text>
              <TextInput
                style={styles.input}
                value={formData.operacao}
                onChangeText={(text) => handleInputChange('operacao', text)}
                placeholder="Digite a operação"
                maxLength={100}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Anotações Extras</Text>
              <TextInput
                style={styles.input}
                value={formData.anotacoes}
                onChangeText={(text) => handleInputChange('anotacoes', text)}
                placeholder="Digite anotações"
                maxLength={1000}
              />
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Atualizar' : 'Salvar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#0d4979ff" />
            ) : pacientes.length === 0 ? (
              <Text style={styles.emptyState}>Nenhuma ficha médica cadastrada</Text>
            ) : (
              <View style={styles.pacientesList}>
                {pacientes.map((paciente) => (
                  <View key={paciente.id} style={styles.pacienteCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{paciente.nome}</Text>
                      <Text style={styles.idBadge}>ID: {paciente.id}</Text>
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.cardText}>
                        <Text style={styles.cardLabel}>Idade:</Text> {paciente.idade} anos
                      </Text>
                      <Text style={styles.cardText}>
                        <Text style={styles.cardLabel}>Endereço:</Text> {paciente.endereco}
                      </Text>
                      <Text style={styles.cardText}>
                        <Text style={styles.cardLabel}>Operação:</Text> {paciente.operacao}
                      </Text>
                    </View>

                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEdit(paciente)}
                      >
                        <Text style={styles.editButtonText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(paciente.id)}
                      >
                        <Text style={styles.deleteButtonText}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0d4979ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  settingsButton: {
    backgroundColor: '#6fabdd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: 'black',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#e53e3e',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorText: {
    color: '#c33',
    backgroundColor: '#fee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputReadOnly: {
    backgroundColor: '#f0f0f0',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#48bb78',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#cbd5e0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    fontSize: 18,
    padding: 40,
  },
  pacientesList: {
    gap: 15,
  },
  pacienteCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
  },
  idBadge: {
    backgroundColor: '#0d4979ff',
    color: 'white',
    padding: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'center',
  },
  cardContent: {
    marginBottom: 15,
  },
  cardText: {
    color: '#555',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 1.6,
  },
  cardLabel: {
    color: '#333',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#bee3f8',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#2c5aa0',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#fed7d7',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#9b2c2c',
    fontWeight: '600',
    fontSize: 14,
  },
});