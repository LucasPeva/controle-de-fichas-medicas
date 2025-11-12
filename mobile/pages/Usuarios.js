import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Usuarios() {
  const navigation = useNavigation();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const API_URL = 'http://localhost:5000/api/usuarios';

  // Verificar autenticação ao carregar
  useEffect(() => {
    const isAuthenticated = global.authenticated;
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const token = global.token;
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao carregar usuários');
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      Alert.alert('Erro', 'Erro ao carregar os dados');
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
  };

  const handleSubmit = async () => {
    if (!formData.username) {
      Alert.alert('Erro', 'Preencha o nome de usuário.');
      return;
    }

    try {
      const token = global.token;
      let response;

      if (editingId) {
        // Atualizar usuário
        response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password || undefined,
          }),
        });
      } else {
        // Criar novo usuário
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) throw new Error('Erro ao salvar usuário');

      await carregarUsuarios();
      setFormData({ username: '', password: '' });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      Alert.alert('Erro', 'Erro ao salvar os dados');
      console.error(err);
    }
  };

  const handleEdit = (usuario) => {
    setFormData({
      username: usuario.username,
      password: '',
    });
    setEditingId(usuario.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja deletar este usuário?',
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

              if (!response.ok) throw new Error('Erro ao deletar usuário');

              await carregarUsuarios();
            } catch (err) {
              Alert.alert('Erro', 'Erro ao deletar o usuário');
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
    setFormData({ username: '', password: '' });
  };

  const handleLogout = () => {
    delete global.token;
    delete global.authenticated;
    navigation.navigate('Login');
  };

  if (showForm) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>MedCard</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.homeButtonText}>Fichas</Text>
            </TouchableOpacity>
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

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{editingId ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome de Usuário</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) => handleInputChange('username', text)}
              maxLength={50}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Senha {editingId && '(deixe em branco para não alterar)'}</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              maxLength={100}
              secureTextEntry
            />
          </View>

          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.btnSuccess} onPress={handleSubmit}>
              <Text style={styles.btnSuccessText}>{editingId ? 'Atualizar' : 'Salvar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancel} onPress={handleCancel}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MedCard</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>Fichas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Configuracoes')}
          >
            <Text style={styles.settingsButtonText}>Configurações</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.newUserButton} 
            onPress={() => setShowForm(true)}
            disabled={loading}
          >
            <Text style={styles.newUserButtonText}>Novo Usuário</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Carregando usuários...</Text>
        ) : usuarios.length === 0 ? (
          <Text style={styles.emptyState}>Nenhum usuário cadastrado</Text>
        ) : (
          <ScrollView style={styles.scrollView}>
            {usuarios.map((usuario) => (
              <View key={usuario.id} style={styles.usuarioCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.usuarioName}>{usuario.username}</Text>
                  <Text style={styles.idBadge}>ID: {usuario.id}</Text>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.createdText}>
                    Criado em: {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                  </Text>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.btnEdit} 
                    onPress={() => handleEdit(usuario)}
                  >
                    <Text style={styles.btnEditText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.btnDelete} 
                    onPress={() => handleDelete(usuario.id)}
                  >
                    <Text style={styles.btnDeleteText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
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
  homeButton: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  homeButtonText: {
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
  newUserButton: {
    backgroundColor: '#0d4979ff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  newUserButtonText: {
    color: 'white',
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
  formContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    margin: 20,
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
    fontSize: 22,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 25,
  },
  btnSuccess: {
    flex: 1,
    backgroundColor: '#48bb78',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSuccessText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  btnCancel: {
    flex: 1,
    backgroundColor: '#cbd5e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCancelText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  usuarioCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
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
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
  },
  usuarioName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  idBadge: {
    backgroundColor: '#0d4979ff',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 15,
  },
  createdText: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnEdit: {
    flex: 1,
    backgroundColor: '#4299e1',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnEditText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  btnDelete: {
    flex: 1,
    backgroundColor: '#f56565',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnDeleteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  emptyState: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
});