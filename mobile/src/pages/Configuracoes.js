import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Configuracoes() {
  const navigation = useNavigation();

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
});