import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import {
  initDatabase,
  addPatient,
  updatePatient,
  deletePatient,
  getAllPatients,
} from "./database";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    operation: "",
  });

  // Inicializa o banco de dados e carrega os pacientes
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDatabase();
      loadPatients();
    } catch (error) {
      Alert.alert("Erro", "Falha ao inicializar o banco de dados");
    }
  };

  const loadPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar pacientes");
    }
  };

  const openModal = (patient = null) => {
    if (patient) {
      setFormData(patient);
      setEditingId(patient.id);
    } else {
      setFormData({ name: "", age: "", address: "", operation: "" });
      setEditingId(null);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setFormData({ name: "", age: "", address: "", operation: "" });
    setEditingId(null);
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.age ||
      !formData.address ||
      !formData.operation
    ) {
      Alert.alert("Erro", "Todos os campos são obrigatórios");
      return;
    }

    try {
      if (editingId) {
        await updatePatient(editingId, formData);
        Alert.alert("Sucesso", "Paciente atualizado com sucesso");
      } else {
        await addPatient(formData);
        Alert.alert("Sucesso", "Paciente adicionado com sucesso");
      }
      loadPatients();
      closeModal();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar paciente");
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja deletar este paciente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await deletePatient(id);
              loadPatients();
              Alert.alert("Sucesso", "Paciente deletado com sucesso");
            } catch (error) {
              Alert.alert("Erro", "Falha ao deletar paciente");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderPatientItem = ({ item }) => (
    <View style={styles.patientCard}>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientText}>Idade: {item.age} anos</Text>
        <Text style={styles.patientText}>Endereço: {item.address}</Text>
        <Text style={styles.patientText}>Operação: {item.operation}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => openModal(item)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MedCard</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {patients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum paciente cadastrado</Text>
        </View>
      ) : (
        <FlatList
          data={patients}
          renderItem={renderPatientItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Editar Paciente" : "Adicionar Paciente"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Idade"
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Endereço"
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Operação realizada"
              value={formData.operation}
              onChangeText={(text) =>
                setFormData({ ...formData, operation: text })
              }
              multiline
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#0d4979ff",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#0d6e04ff",
    fontWeight: "bold",
    fontSize: 14,
  },
  listContainer: {
    padding: 15,
  },
  patientCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  patientInfo: {
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  patientText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginHorizontal: 5,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#0d6e04ff",
  },
  deleteButton: {
    backgroundColor: "#e12315ff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  saveButton: {
    backgroundColor: "#2196F3",
  },
});
