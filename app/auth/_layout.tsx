import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTheme } from "@/hooks/ThemeContext";
import { useTranslation } from "react-i18next";

export default function AuthLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "tabIconDefault");
  const textColor = useThemeColor({}, "text");

  const { theme, toggleTheme } = useTheme();

  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const animW = useRef(new Animated.Value(-150)).current;
  const animC = useRef(new Animated.Value(150)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animW, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(animC, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animW, animC]);

  const toggleLanguage = () => {
    const newLang = language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.logoContainer}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={styles.themeToggleButton}
          accessibilityLabel="Toggle theme"
          accessibilityHint="Alterna entre modo claro e modo escuro"
        >
          {theme === "light" ? (
            <Ionicons name="sunny" size={28} color={textColor} />
          ) : (
            <Ionicons name="moon" size={28} color={textColor} />
          )}
        </TouchableOpacity>

        <View style={styles.logoWCContainer}>
          <Animated.Text
            style={[
              styles.logoW,
              { color: textColor, transform: [{ translateX: animW }] },
            ]}
          >
            W
          </Animated.Text>
          <Animated.Text
            style={[
              styles.logoC,
              { color: textColor, transform: [{ translateX: animC }] },
            ]}
          >
            C
          </Animated.Text>
        </View>
      </View>

      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {/* Language switcher button */}
      <View style={styles.languageSwitcherContainer}>
        <TouchableOpacity
          onPress={toggleLanguage}
          style={styles.languageButton}
        >
          <Text style={[styles.languageButtonText, { color: textColor }]}>
            {language === "pt" ? "Português 🇵🇹" : "English 🇺🇸"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.footer, { borderColor }]}>
        <Text style={[styles.footerText, { color: textColor }]}>
          © {new Date().getFullYear()} Webcreaterpt
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    width: "100%",
  },
  themeToggleButton: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    alignSelf: "center",
    marginBottom: 10,
  },
  logoWCContainer: {
    width: 150,
    height: 120,
    position: "relative",
    alignSelf: "center",
  },
  logoW: {
    fontSize: 100,
    fontWeight: "bold",
    position: "absolute",
    top: 0,
    left: 0,
  },
  logoC: {
    fontSize: 100,
    fontWeight: "bold",
    position: "absolute",
    top: 0,
    left: 75,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  footer: {
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 8,
  },
  languageSwitcherContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  languageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#888",
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
