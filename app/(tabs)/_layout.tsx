import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { useAuth } from "../../hooks/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";

export const TAB_CONFIG = {
  home: { icon: "home", labelKey: "home" },
  calendar: { icon: "calendar", labelKey: "calendar" },
  projects: { icon: "person", labelKey: "projects.title" },
  settings: { icon: "settings", labelKey: "settings" },
} as const;

type TabName = keyof typeof TAB_CONFIG;

function TopBar() {
  const { t } = useTranslation();
  const { authState, logout } = useAuth();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  const background = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "tabIconDefault");
  const textColor = useThemeColor({}, "text");
  const cardBackground = useThemeColor({}, "background");

  const notifications = [
    {
      id: "1",
      title: t("newMessageFrom", { name: "João" }) || "Nova mensagem de João",
    },
    { id: "2", title: t("updateAvailable") || "Atualização disponível" },
    {
      id: "3",
      title: t("eventTomorrowAt", { time: "15h" }) || "Evento amanhã às 15h",
    },
  ];

  const welcomeText = authState?.signedIn
    ? `${t("welcome")} ${authState.name}`
    : t("welcome");

  return (
    <View
      style={[
        styles.topBar,
        { backgroundColor: background, borderBottomColor: borderColor },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          name="happy-outline"
          size={24}
          color={textColor}
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.welcomeText, { color: textColor }]}>
          {welcomeText}
        </Text>
      </View>

      <View style={styles.iconGroup}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ marginRight: 14 }}
          accessibilityLabel={t("notifications")}
        >
          <View>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={textColor}
            />
            <View style={[styles.badge, { backgroundColor: "#007AFF" }]}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
          accessibilityLabel={t("logout")}
        >
          <Ionicons name="log-out-outline" size={26} color={textColor} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: cardBackground }]}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeIconButton}
              accessibilityLabel={t("closeModal")}
            >
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>

            <Text style={[styles.modalTitle, { color: textColor }]}>
              {t("notifications")}
            </Text>

            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="notifications-off-outline"
                  size={48}
                  color="#999"
                  style={{ marginBottom: 12 }}
                />
                <Text style={styles.emptyText}>{t("noNotifications")}</Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 12 }}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.notificationItem,
                      { backgroundColor: background },
                    ]}
                  >
                    <Ionicons
                      name="notifications"
                      size={20}
                      color="#007AFF"
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      style={[styles.notificationText, { color: textColor }]}
                    >
                      {item.title}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function Layout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const activeTint = useThemeColor({}, "tabIconSelected");
  const inactiveTint = useThemeColor({}, "tabIconDefault");
  const background = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "tabIconDefault");

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <SafeAreaView edges={["top"]}>
        <TopBar />
      </SafeAreaView>
      <Tabs
        screenOptions={({ route }) => {
          const { icon, labelKey } = TAB_CONFIG[route.name as TabName] || {
            icon: "help-circle",
            labelKey: route.name,
          };

          return {
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={icon} size={size} color={color} />
            ),
            tabBarLabel: t(labelKey),
            tabBarActiveTintColor: activeTint,
            tabBarInactiveTintColor: inactiveTint,
            tabBarStyle: {
              backgroundColor: background,
              borderTopColor: borderColor,
              paddingBottom: insets.bottom,
              height: 50 + insets.bottom,
            },
            headerShown: false,
          };
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: "relative",
  },
  closeIconButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#E8F0FE",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  notificationText: {
    fontSize: 16,
    flexShrink: 1,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
