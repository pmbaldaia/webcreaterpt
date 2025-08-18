import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/ThemeContext";

const shopifyLogo = require("../../assets/images/shopifyLogo.png");
const shopifyLogoWhite = require("../../assets/images/shopifyLogoWhite.png");

export default function HomeScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const accent = useThemeColor({}, "tabIconDefault");
  const logoSource = theme === "dark" ? shopifyLogoWhite : shopifyLogo;

  return (
    <ScrollView
      style={[{ backgroundColor: background }]}
      contentContainerStyle={styles.container}
    >
      <Image
        source={logoSource}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel="Logo Shopify"
      />
      <Text style={[styles.title, { color: text }]}>
        {t("homeGreeting") ||
          "Impulsione o seu negócio com uma loja online personalizada e profissional."}
      </Text>
      <Text style={[styles.subtitle, { color: accent }]}>
        {t("homeProposal") ||
          "Somos parceiros oficiais Shopify — criamos, configuramos e lançamos a sua loja e-commerce para garantir o seu sucesso."}
      </Text>
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Text style={[styles.featureText, { color: text }]}>
            ✅ Integração completa com Shopify
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={[styles.featureText, { color: text }]}>
            ✅ Design moderno e responsivo
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={[styles.featureText, { color: text }]}>
            ✅ Configuração de pagamento e envios
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={[styles.featureText, { color: text }]}>
            ✅ Suporte e acompanhamento personalizado
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Vamos começar a sua loja!")}
        activeOpacity={0.85}
        accessibilityLabel={t("startButton") || "Começar"}
      >
        <Text style={styles.buttonText}>
          {t("startButtonText") || "Quero começar agora!"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: 100,
    height: 50,
    marginBottom: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 40,
    maxWidth: 380,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    maxWidth: 380,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 32,
  },
  featureItem: {
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "black",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: "white",
  },
});
