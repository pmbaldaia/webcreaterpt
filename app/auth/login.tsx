import { useTheme } from "@/hooks/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/AuthContext";

export default function EcrãLogin() {
  const [utilizador, setUtilizador] = useState("");
  const [palavraPasse, setPalavraPasse] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { setAuthState } = useAuth();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "tabIconDefault");
  const { theme } = useTheme();

  const { t } = useTranslation();

  const [errosInput, setErrosInput] = useState({
    utilizador: false,
    palavraPasse: false,
  });

  const aoIniciarSessao = () => {
    const temUtilizador = !!utilizador;
    const temPalavraPasse = !!palavraPasse;

    if (!temUtilizador || !temPalavraPasse) {
      setErrosInput({
        utilizador: !temUtilizador,
        palavraPasse: !temPalavraPasse,
      });

      Alert.alert(
        t("error") || "Erro",
        t("fillUsernamePassword") ||
          "Preencha o nome de utilizador e a palavra-passe."
      );
      return;
    }

    setErrosInput({ utilizador: false, palavraPasse: false });

    const users = [
      { name: "Admin", username: "admin", password: "admin" },
      { name: "Rita", username: "rita", password: "rita" },
      { name: "Teste", username: "teste", password: "teste" },
    ];

    const userEncontrado = users.find(
      (user) => user.username === utilizador && user.password === palavraPasse
    );

    if (userEncontrado) {
      setAuthState({
        id: userEncontrado.username,
        name: userEncontrado.name,
        username: userEncontrado.username,
        signedIn: true,
      });

      router.replace("/home");
    } else {
      Alert.alert(
        t("error") || "Erro",
        t("incorrectUsernamePassword") ||
          "Nome de utilizador ou palavra-passe incorretos."
      );
    }
  };

  const aoCriarConta = () => {
    router.push("/auth/register");
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        {t("login") || "Iniciar Sessão"}
      </Text>

      <View
        style={[
          styles.inputContainer,
          { borderColor: errosInput.utilizador ? "red" : borderColor },
        ]}
      >
        <Ionicons
          name="person-outline"
          size={20}
          color={errosInput.utilizador ? "red" : textColor}
          style={styles.icon}
        />
        <TextInput
          placeholder={t("username") || "Nome de utilizador"}
          accessibilityLabel={
            t("usernameField") || "Campo do nome de utilizador"
          }
          placeholderTextColor={textColor}
          value={utilizador}
          onChangeText={setUtilizador}
          autoCapitalize="none"
          style={[styles.input, { color: textColor }]}
        />
      </View>

      <View
        style={[
          styles.inputContainer,
          { borderColor: errosInput.palavraPasse ? "red" : borderColor },
        ]}
      >
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={errosInput.palavraPasse ? "red" : textColor}
          style={styles.icon}
        />
        <TextInput
          placeholder={t("password") || "Palavra-passe"}
          accessibilityLabel={t("passwordField") || "Campo da palavra-passe"}
          placeholderTextColor={textColor}
          value={palavraPasse}
          onChangeText={setPalavraPasse}
          autoCapitalize="none"
          secureTextEntry={!mostrarSenha}
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
          styles.buttonLogin,
          { backgroundColor: theme === "light" ? "#000" : "#fff" },
        ]}
        onPress={aoIniciarSessao}
        accessibilityLabel={t("loginButton") || "Botão de iniciar sessão"}
      >
        <Text
          style={[
            styles.buttonText,
            { color: theme === "light" ? "#fff" : "#000" },
          ]}
        >
          {t("loginButtonText") || "Entrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={aoCriarConta} style={styles.registerLink}>
        <Text style={[styles.registerText, { color: textColor }]}>
          {t("noAccount") || "Ainda não tens conta? Criar conta"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
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
  buttonLogin: {
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 16,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
