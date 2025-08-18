import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Slot } from "expo-router";
import { ThemeProvider, useTheme } from "../hooks/ThemeContext";
import { AuthProvider } from "../hooks/AuthContext";

import "@/src/i18n/i18n";

function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        <Slot />
      </View>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
