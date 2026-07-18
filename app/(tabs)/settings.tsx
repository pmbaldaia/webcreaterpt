import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { demoProfile } from "@/src/data/demoContent";
import i18n from "@/src/i18n/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type IdiomaChave = "pt" | "en";

const idiomasDisponiveis: Record<
  IdiomaChave,
  { label: string; bandeira: any }
> = {
  pt: {
    label: "Português",
    bandeira: require("@/assets/images/flags/pt.webp"),
  },
  en: {
    label: "English",
    bandeira: require("@/assets/images/flags/en.webp"),
  },
};

export default function EcrãDefinicoes() {
  const { theme, toggleTheme } = useTheme();
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const corPrincipal = "#3b82f6";
  const corInterruptor = "#1e3a8a";

  const languageBackground = useThemeColor({}, "languageBackground");
  const languageBorder = useThemeColor({}, "languageBorder");
  const languageText = useThemeColor({}, "languageText");
  const languageDropdownBackground = useThemeColor(
    {},
    "languageDropdownBackground",
  );

  const temaEscuroAtivo = theme === "dark";
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const alternarNotificacoes = () =>
    setNotificacoesAtivas((anterior) => !anterior);

  const { authState, logout } = useAuth();
  const router = useRouter();

  const terminarSessao = () => {
    logout();
    router.replace("/auth/login");
  };

  const [idiomaAtual, setIdiomaAtual] = useState<IdiomaChave>("pt");
  const [showIdiomaMenu, setShowIdiomaMenu] = useState(false);
  const [activeDocument, setActiveDocument] = useState<
    "privacy" | "terms" | null
  >(null);

  useEffect(() => {
    (async () => {
      const idiomaSalvo = await AsyncStorage.getItem("appLanguage");
      if (idiomaSalvo && (idiomaSalvo === "pt" || idiomaSalvo === "en")) {
        setIdiomaAtual(idiomaSalvo as IdiomaChave);
        i18n.changeLanguage(idiomaSalvo);
      } else {
        setIdiomaAtual((i18n.language as IdiomaChave) || "pt");
      }
    })();
  }, []);

  useEffect(() => {
    i18n.changeLanguage(idiomaAtual);
    AsyncStorage.setItem("appLanguage", idiomaAtual);
  }, [idiomaAtual]);

  const selecionarIdioma = (novoIdioma: IdiomaChave) => {
    setIdiomaAtual(novoIdioma);
    setShowIdiomaMenu(false);
  };

  const privacyContent = [
    "A Demo Studio coleta apenas os dados necessários para fornecer a experiência completa da aplicação, como nome de utilizador, preferências de idioma e configurações de notificação.",
    "As informações são armazenadas localmente no dispositivo e em servidores de demonstração para garantir que o fluxo da app funcione corretamente em ambientes de teste.",
    "Não partilhamos dados pessoais com terceiros sem consentimento explícito, exceto para serviços essenciais de armazenamento ou suporte técnico.",
    "Os utilizadores podem gerir as suas preferências a qualquer momento nas definições da aplicação.",
  ];

  const termsContent = [
    "Ao utilizar esta aplicação de demonstração, concorda em usar o conteúdo e os serviços fornecidos apenas para fins de teste, apresentação ou validação de fluxo.",
    "Os dados, textos e imagens apresentados são fictícios e servem apenas para ilustrar o funcionamento geral da app.",
    "Não é permitida a reprodução comercial ou redistribuição do conteúdo sem autorização explícita.",
    "A equipa responsável pode alterar, remover ou expandir funcionalidades a qualquer momento sem aviso prévio, sobretudo em versões de demonstração.",
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: textColor }]}>
        {i18n.t("settings") || "Definições"}
      </Text>

      <View style={[styles.profileCard, { backgroundColor: corPrincipal }]}>
        <Text style={styles.profileName}>
          {authState?.name || demoProfile.name}
        </Text>
        <Text style={styles.profileSubtitle}>
          {demoProfile.role} • {demoProfile.plan}
        </Text>
        <Text style={styles.profileSubtitle}>{demoProfile.email}</Text>
      </View>

      <View style={[styles.row, { borderColor: corPrincipal }]}>
        <Text style={[styles.label, { color: textColor }]}>
          {i18n.t("language") || "Idioma"}
        </Text>

        <View>
          <TouchableOpacity
            style={[
              styles.languageSelector,
              {
                backgroundColor: languageBackground,
                borderColor: languageBorder,
              },
            ]}
            onPress={() => setShowIdiomaMenu((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Image
              source={idiomasDisponiveis[idiomaAtual].bandeira}
              style={styles.flag}
            />
            <Text style={[styles.languageLabel, { color: languageText }]}>
              {idiomasDisponiveis[idiomaAtual].label}
            </Text>
            <Text style={{ color: corPrincipal, marginLeft: 8 }}>
              {showIdiomaMenu ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {showIdiomaMenu && (
            <View
              style={[
                styles.dropdown,
                {
                  backgroundColor: languageDropdownBackground,
                  borderColor: languageBorder,
                },
              ]}
            >
              {Object.entries(idiomasDisponiveis).map(
                ([chave, { label, bandeira }]) => (
                  <TouchableOpacity
                    key={chave}
                    style={styles.dropdownItem}
                    onPress={() => selecionarIdioma(chave as IdiomaChave)}
                    activeOpacity={0.7}
                  >
                    <Image source={bandeira} style={styles.flag} />
                    <Text
                      style={[styles.languageLabel, { color: languageText }]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          )}
        </View>
      </View>

      <View style={[styles.row, { borderColor: corPrincipal }]}>
        <Text style={[styles.label, { color: textColor }]}>
          {i18n.t("darkTheme") || "Tema escuro"}
        </Text>
        <Switch
          trackColor={{ false: "#a5b4fc", true: "#bfdbfe" }}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleTheme}
          value={temaEscuroAtivo}
          thumbColor={temaEscuroAtivo ? corInterruptor : "#f4f3f4"}
        />
      </View>

      <View style={[styles.row, { borderColor: corPrincipal }]}>
        <Text style={[styles.label, { color: textColor }]}>
          {i18n.t("enableNotifications") || "Ativar notificações"}
        </Text>
        <Switch
          trackColor={{ false: "#a5b4fc", true: "#bfdbfe" }}
          ios_backgroundColor="#3e3e3e"
          onValueChange={alternarNotificacoes}
          value={notificacoesAtivas}
          thumbColor={notificacoesAtivas ? corInterruptor : "#f4f3f4"}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {i18n.t("account") || "Conta"}
        </Text>
        <TouchableOpacity style={[styles.link, { borderColor: corPrincipal }]}>
          <Text style={[styles.linkText, { color: corPrincipal }]}>
            {i18n.t("editProfile") || "Editar perfil"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.link, { borderColor: corPrincipal }]}>
          <Text style={[styles.linkText, { color: corPrincipal }]}>
            {i18n.t("changePassword") || "Alterar palavra-passe"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.link, { borderColor: corPrincipal }]}
          onPress={terminarSessao}
        >
          <Text style={[styles.linkText, { color: corPrincipal }]}>
            {i18n.t("logout") || "Terminar sessão"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {i18n.t("about") || "Sobre"}
        </Text>
        <Text style={[styles.text, { color: textColor }]}>
          {i18n.t("appVersion") || "Versão da aplicação"}: 1.0.0
        </Text>
        <TouchableOpacity
          style={[styles.link, { borderColor: corPrincipal }]}
          onPress={() => setActiveDocument("privacy")}
        >
          <Text style={[styles.linkText, { color: corPrincipal }]}>
            {i18n.t("privacyPolicy") || "Política de privacidade"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.link, { borderColor: corPrincipal }]}
          onPress={() => setActiveDocument("terms")}
        >
          <Text style={[styles.linkText, { color: corPrincipal }]}>
            {i18n.t("termsOfUse") || "Termos de utilização"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={activeDocument !== null}
        onRequestClose={() => setActiveDocument(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                {activeDocument === "privacy"
                  ? "Política de Privacidade"
                  : "Termos de Utilização"}
              </Text>
              <TouchableOpacity onPress={() => setActiveDocument(null)}>
                <Text style={[styles.closeText, { color: corPrincipal }]}>
                  Fechar
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.modalIntro, { color: textColor }]}>
                {activeDocument === "privacy"
                  ? "Esta é uma versão de demonstração com conteúdo fictício para ilustrar o fluxo da aplicação."
                  : "Estes termos servem como exemplo de utilização para a demo da aplicação."}
              </Text>
              {(activeDocument === "privacy"
                ? privacyContent
                : termsContent
              ).map((item, index) => (
                <View key={index} style={styles.modalBullet}>
                  <Text style={[styles.modalBulletText, { color: textColor }]}>
                    • {item}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "300",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1,
  },
  profileCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  profileName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  profileSubtitle: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: "rgba(59, 130, 246, 0.06)",
  },
  label: {
    fontSize: 17,
    fontWeight: "500",
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  flag: {
    width: 32,
    height: 24,
    resizeMode: "cover",
    borderRadius: 3,
    marginRight: 12,
  },
  languageLabel: {
    fontSize: 17,
    fontWeight: "400",
  },
  dropdown: {
    position: "absolute",
    top: 48,
    left: 0,
    width: 180,
    borderWidth: 1,
    borderRadius: 12,
    zIndex: 10,
    paddingVertical: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  section: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  link: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 6,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "500",
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    borderRadius: 20,
    padding: 18,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  closeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalBody: {
    paddingTop: 4,
  },
  modalIntro: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  modalBullet: {
    marginBottom: 10,
  },
  modalBulletText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
