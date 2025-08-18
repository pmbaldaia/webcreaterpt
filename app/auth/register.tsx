import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/hooks/ThemeContext";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  const { setAuthState } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "tabIconDefault");
  const { theme } = useTheme();

  const { t } = useTranslation();

  async function handleRegister() {
    if (!username || !password) {
      Alert.alert(
        t("error") || "Erro",
        t("fillUsernamePassword") ||
          "Preencha o nome de utilizador e a palavra-passe."
      );
      return;
    }

    setLoading(true);

    try {
      const usersRaw = await AsyncStorage.getItem("users");
      const users = usersRaw ? JSON.parse(usersRaw) : {};

      if (users[username]) {
        Alert.alert(
          t("error") || "Erro",
          t("usernameExists") || "Este nome de utilizador já existe."
        );
        setLoading(false);
        return;
      }

      users[username] = password;
      await AsyncStorage.setItem("users", JSON.stringify(users));

      const auth = {
        id: Date.now().toString(),
        name,
        username,
        signedIn: true,
      };

      await AsyncStorage.setItem("auth", JSON.stringify(auth));
      setAuthState(auth);
      router.replace("/home");
    } catch (err) {
      console.error("Erro no registo", err);
      Alert.alert(
        t("error") || "Erro",
        t("registerFailed") || "Não foi possível concluir o registo."
      );
    }

    setLoading(false);
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        {t("createAccount") || "Criar Conta"}
      </Text>

      <View style={[styles.inputContainer, { borderColor }]}>
        <Ionicons
          name="person-outline"
          size={20}
          color={textColor}
          style={styles.icon}
        />
        <TextInput
          placeholder={t("name") || "Nome"}
          placeholderTextColor={borderColor}
          onChangeText={setName}
          value={name}
          autoCapitalize="words"
          style={[styles.input, { color: textColor }]}
        />
      </View>

      <View style={[styles.inputContainer, { borderColor }]}>
        <Ionicons
          name="person-circle-outline"
          size={20}
          color={textColor}
          style={styles.icon}
        />
        <TextInput
          placeholder={t("username") || "Nome de utilizador"}
          placeholderTextColor={borderColor}
          autoCapitalize="none"
          onChangeText={setUsername}
          value={username}
          style={[styles.input, { color: textColor }]}
        />
      </View>

      <View style={[styles.inputContainer, { borderColor }]}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={textColor}
          style={styles.icon}
        />
        <TextInput
          placeholder={t("password") || "Palavra-passe"}
          placeholderTextColor={borderColor}
          secureTextEntry={!mostrarSenha}
          onChangeText={setPassword}
          value={password}
          style={[styles.input, { color: textColor }]}
        />
        <TouchableOpacity
          onPress={() => setMostrarSenha(!mostrarSenha)}
          style={styles.iconButton}
          accessibilityLabel={
            mostrarSenha
              ? t("hidePassword") || "Esconder palavra-passe"
              : t("showPassword") || "Mostrar palavra-passe"
          }
        >
          <Ionicons
            name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={textColor}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme === "light" ? "#000" : "#fff" },
          loading && { opacity: 0.6 },
        ]}
        onPress={handleRegister}
        disabled={loading}
        accessibilityLabel={t("registerButton") || "Registar"}
      >
        <Text
          style={[
            styles.buttonText,
            { color: theme === "light" ? "#fff" : "#000" },
          ]}
        >
          {loading
            ? t("registering") || "A registar..."
            : t("register") || "Registar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/login")}
        style={styles.loginLink}
      >
        <Text style={[styles.loginText, { color: textColor }]}>
          {t("alreadyHaveAccount") || "Já tem conta? Inicie sessão"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  iconButton: {
    paddingHorizontal: 4,
  },
  input: {
    flex: 1,
    height: 48,
  },
  button: {
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 16,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
