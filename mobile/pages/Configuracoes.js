import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getConfig, updateConfig } from '../config';

export default function Configuracoes() {
  const navigation = useNavigation();
  const [config, setConfig] = useState({ apiBaseUrl: '' });
  const [showIpConfig, setShowIpConfig] = useState(false);
  const [tempIp, setTempIp] = useState('');

  useEffect(() => {
    const loadConfig = async () => {
      const appConfig = await getConfig();
      setConfig(appConfig);
      setTempIp(appConfig.apiBaseUrl.replace('http://', '').replace('https://', ''));
    };
    loadConfig();
  }, []);

  const handleLogout = () => {
    delete global.token;
    delete global.authenticated;
    navigation.navigate('Login');
  };

  const handleSaveIp = async () => {
    if (!tempIp.trim()) {
      Alert.alert('Erro', 'Por favor, insira um endereço IP válido');
      return;
    }

    // Validação formatação de IP
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\d+)?$/;
    if (!ipRegex.test(tempIp)) {
      Alert.alert('Erro', 'Formato de IP inválido. Use formato como: 192.168.1.1:5000');
      return;
    }

    try {
      const newBaseUrl = tempIp.includes(':') ? `http://${tempIp}` : `http://${tempIp}:5000`;
      await updateConfig({ apiBaseUrl: newBaseUrl });
      setConfig({ apiBaseUrl: newBaseUrl });
      setShowIpConfig(false);
      Alert.alert('Sucesso', 'Configuração de IP atualizada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar configuração');
      console.error(error);
    }
  };

  const handleCancelIp = () => {
    setTempIp(config.apiBaseUrl.replace('http://', '').replace('https://', ''));
    setShowIpConfig(false);
  };

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
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.pacientesList}>
          <View style={styles.pacienteCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Configurações do Servidor</Text>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Endereço do Servidor:</Text>
                <Text style={styles.infoValue}>{config.apiBaseUrl}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setShowIpConfig(true)}
                >
                  <Text style={styles.editButtonText}>Alterar IP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.pacienteCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Usuários</Text>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('Usuarios')}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {showIpConfig && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Configurar Endereço do Servidor</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Endereço IP e Porta:</Text>
                <TextInput
                  style={styles.input}
                  value={tempIp}
                  onChangeText={(text) => setTempIp(text)}
                  placeholder="Ex: 192.168.1.1:5000"
                  maxLength={50}
                />
                <Text style={styles.helperText}>Formato: IP:PORTA (ex: 192.168.1.1:5000)</Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveIp}>
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelIp}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  cardContent: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
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
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
  modalButtons: {
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
});