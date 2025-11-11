import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getApiUrl } from "../config";

export default function TelaLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
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
      const loginUrl = await getApiUrl('/api/login');
      const response = await fetch(loginUrl, {
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
      global.token = data.token;
      global.authenticated = true;

      navigation.navigate("Home");
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginForm}>
        <Text style={styles.title}>MedCard</Text>
        <Text style={styles.subtitle}>
          Acesse seu sistema de fichas médicas
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => handleInputChange("username", text)}
            editable={!loading}
            placeholder="Digite seu usuário"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
            editable={!loading}
            placeholder="Digite sua senha"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={
            loading ? [styles.button, styles.buttonDisabled] : styles.button
          }
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d4979ff",
    padding: 20,
  },
  loginForm: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    color: "#333",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  errorText: {
    color: "#c33",
    backgroundColor: "#fee",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: "center",
    width: "100%",
  },
  formGroup: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    backgroundColor: "#0d4979ff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
